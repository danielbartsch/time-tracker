import * as React from 'react'
import { isEqual } from './date'
import { holidays, weekDays, defaultWorkTimes, weekendDays, DayIndex, WorkTime } from './config'

const padNumber = (number: number, pad: number, zeros: boolean = true): string => {
  if (pad < 1) {
    return String(number)
  }

  const digits = (number === 0 ? 0 : Math.floor(Math.log10(number))) + 1
  return `${Array.from({ length: pad - digits })
    .map(() => (zeros ? '0' : ' '))
    .join('')}${number}`
}

const Day = ({ value }: { value: Date }) => (
  <>
    {weekDays[value.getDay()]}. {padNumber(value.getFullYear(), 4)}-
    {padNumber(value.getMonth() + 1, 2)}-{padNumber(value.getDate(), 2)}
  </>
)

const Time = ({ value }: { value: Date }) => (
  <>
    {padNumber(value.getHours(), 2)}:{padNumber(value.getMinutes(), 2)}
  </>
)

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

const WorkTimes = ({ value: [[start, end], ...breaks] }: { value: WorkTime }) => (
  <>
    <td>
      <Time value={start} />
    </td>
    <td>
      <Time value={end} />
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
