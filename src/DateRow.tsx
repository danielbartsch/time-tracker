import * as React from 'react'
import { isEqual, toString, fromString } from './date'
import { holidays, defaultWorkTimes, weekendDays, DayIndex, WorkTime } from './config'
import { padNumber } from './utils'

const Day = ({ value }: { value: Date }) => <>{toString(value, 'W0. Y4-M2-D2')}</>

const Time = ({ value }: { value: Date }) => <>{toString(value, 'h2:m2')}</>

const TimeInput = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => {
  return (
    <input
      type="time"
      value={toString(value, 'h2:m2')}
      onChange={event => onChange(fromString(event.target.value, 'h2:m2'))}
      required
    />
  )
}

type Timestamp = number
const Duration = ({ value }: { value: Timestamp }) => {
  const hours = value / (1000 * 60 * 60)
  const minutes = (hours - Math.floor(hours)) * 60
  return (
    <>
      {padNumber(Math.floor(hours), 2)}:{padNumber(Math.floor(minutes), 2)}h
    </>
  )
}

const WorkTimes = ({ value }: { value: WorkTime }) => {
  const [[[start, end], ...breaks], setWorkTime] = React.useState(value)
  return (
    <>
      <td>
        <TimeInput
          value={start}
          onChange={date =>
            setWorkTime(previousWorkTime => [
              [date, previousWorkTime[0][1]],
              ...previousWorkTime.slice(1),
            ])
          }
        />
      </td>
      <td>
        <TimeInput
          value={end}
          onChange={date =>
            setWorkTime(previousWorkTime => [
              [previousWorkTime[0][0], date],
              ...previousWorkTime.slice(1),
            ])
          }
        />
      </td>
      <td>
        {breaks.map(([breakStart, breakEnd]) => (
          <React.Fragment key={`${breakStart.getHours()}-${breakStart.getMinutes()}`}>
            <Time value={breakStart} />-<Time value={breakEnd} />
          </React.Fragment>
        ))}
      </td>
      <td>
        <Duration
          value={new Date(
            end.getTime() -
              start.getTime() -
              breaks.reduce(
                (sum, [breakStart, breakEnd]) => sum + (breakEnd.getTime() - breakStart.getTime()),
                0
              )
          ).getTime()}
        />
      </td>
    </>
  )
}

const DayStyle = ({
  children,
  todaysHolidays,
}: {
  children: React.ReactNode
  todaysHolidays: Array<string>
}) => {
  let textColor = undefined
  if (todaysHolidays.length > 0) {
    textColor = 'green'
  }

  let tooltip = todaysHolidays.slice()
  return (
    <code title={tooltip.join(' ')} style={textColor ? { color: textColor } : undefined}>
      {children}
    </code>
  )
}

export const DateRow = ({ date }: { date: Date }) => {
  const todaysHolidays = holidays.filter(([, isHoliday]) => isHoliday(date)).map(([name]) => name)

  const weekDay = date.getDay() as DayIndex

  const isWorkday = defaultWorkTimes[weekDay].length > 0 && todaysHolidays.length === 0
  const isWeekend = weekendDays.includes(weekDay)

  return (
    <tr key={`${date}`} style={isEqual(date, new Date()) ? { backgroundColor: '#343' } : undefined}>
      <td className="date">
        <DayStyle todaysHolidays={todaysHolidays}>
          <Day value={date} />
        </DayStyle>
      </td>
      {isWorkday ? (
        <WorkTimes value={defaultWorkTimes[weekDay]} />
      ) : (
        <>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </>
      )}
      <td>{todaysHolidays.length > 0 ? todaysHolidays.join(', ') : undefined}</td>
      <td>{isWorkday ? 'o' : undefined}</td>
      <td>{isWeekend ? 'o' : undefined}</td>
    </tr>
  )
}
