import * as React from 'react'
import { isEqual, toString, fromString, dateString } from './date'
import { holidays, defaultWorkTimes, weekendDays, DayIndex, WorkTime } from './config'
import { padNumber } from './utils'

type SetState<T> = (value: T | ((value: T) => T)) => void
export const useStateWithUpdater = <T,>(
  initialValue: T,
  updater: (value: T) => void,
  delay: number
): [T, SetState<T>] => {
  const [stateValue, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (stateValue !== initialValue) {
        updater(stateValue)
      }
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [stateValue, delay, initialValue, updater])

  return [stateValue, setValue]
}

const Day = ({ value }: { value: Date }) => <>{toString(value, 'W0. Y4-M2-D2')}</>

const Time = ({ value }: { value: Date }) => <>{toString(value, 'h2:m2')}</>

const TimeInput = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => {
  return (
    <input
      type="time"
      value={toString(value, 'h2:m2')}
      onChange={event => {
        const date = new Date(value)
        const newTime = fromString(event.target.value, 'h2:m2')
        date.setHours(newTime.getHours())
        date.setMinutes(newTime.getMinutes())
        onChange(date)
      }}
      required
    />
  )
}

type Timestamp = number
const Duration = ({ value }: { value: Timestamp }) => {
  const hours = value / (1000 * 60 * 60)
  const fullHours = hours < 0 ? Math.ceil(hours) : Math.floor(hours)
  const minutes = Math.abs((hours - fullHours) * 60)
  return (
    <>
      {hours < 0 && '-'}
      {padNumber(Math.abs(fullHours), 2)}:{padNumber(Math.round(Math.abs(minutes)), 2)}h
    </>
  )
}

const patchTimeWithDate = (time: Date, date: Date): Date => {
  const newDate = new Date(time)
  newDate.setFullYear(date.getFullYear())
  newDate.setMonth(date.getMonth())
  newDate.setDate(date.getDate())
  return newDate
}

const patchWorkTime = (date: Date, workTime: WorkTime): WorkTime =>
  workTime.map(([start, end]) => [patchTimeWithDate(start, date), patchTimeWithDate(end, date)])

const WorkTimes = ({
  value,
  date,
  onSave,
}: {
  value: WorkTime
  date: Date
  onSave: (workTime: WorkTime) => void
}) => {
  const [[[start, end], ...breaks], setWorkTime] = useStateWithUpdater<WorkTime>(
    value,
    onSave,
    5000
  )
  return (
    <>
      <td>
        <TimeInput
          value={start}
          onChange={newDate =>
            setWorkTime(previousWorkTime =>
              patchWorkTime(date, [[newDate, previousWorkTime[0][1]], ...previousWorkTime.slice(1)])
            )
          }
        />
      </td>
      <td>
        <TimeInput
          value={end}
          onChange={newDate =>
            setWorkTime(previousWorkTime =>
              patchWorkTime(date, [[previousWorkTime[0][0], newDate], ...previousWorkTime.slice(1)])
            )
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

export const fetchWorkTimes = () => {
  const workTimes: { [key: string]: Array<[string, string]> } = JSON.parse(
    window.localStorage.getItem('workTimes') ?? '{}'
  )
  return Object.entries(workTimes).reduce<{ [key: string]: WorkTime }>(
    (workTimes, [day, worktime]) => {
      workTimes[day] = worktime.map(([start, end]) => [new Date(start), new Date(end)])
      return workTimes
    },
    {}
  )
}

const saveWorkTime = (workTime: WorkTime) => {
  window.localStorage.setItem(
    'workTimes',
    JSON.stringify({
      ...fetchWorkTimes(),
      [dateString(workTime[0][0])]: workTime,
    })
  )
}

export const DateRow = ({ date, workTime }: { date: Date; workTime: WorkTime | null }) => {
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
        <WorkTimes
          value={workTime ?? defaultWorkTimes[weekDay]}
          date={date}
          onSave={saveWorkTime}
        />
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
