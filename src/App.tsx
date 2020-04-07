import React from 'react'
import { defaultWorkTimes, weekendDays, holidays, weekDays, DayIndex, WorkTime } from './config'
import { addDays, isEqual } from './date'

const getDateWithoutTime = (datetime: Date) =>
  new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate())

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

const Time = ({ value }: { value: Date }) => (
  <>
    {padNumber(value.getHours(), 2)}:{padNumber(value.getMinutes(), 2)}
  </>
)

const WorkTimes = ({ value: [[start, end], ...breaks] }: { value: WorkTime }) => {
  return (
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
        <Time
          value={
            new Date(
              end.getTime() -
                start.getTime() -
                breaks.reduce(
                  (sum, [breakStart, breakEnd]) =>
                    sum + (breakEnd.getTime() - breakStart.getTime()),
                  0
                )
            )
          }
        />
      </td>
    </>
  )
}

const useEventListener = (event: string, listener: (event: any) => void) => {
  React.useEffect(() => document.addEventListener(event, listener), []) // eslint-disable-line react-hooks/exhaustive-deps
}

const useTouchDrag = (
  [stepX, stepY]: [number, number],
  listener: (xDelta: number, yDelta: number) => void
) => {
  const touchStart = React.useRef<{ x: number; y: number } | null>()

  useEventListener('touchstart', (event: TouchEvent) => {
    const { pageX: x, pageY: y } = event.touches[0]
    touchStart.current = { x, y }
  })
  useEventListener('touchmove', (event: TouchEvent) => {
    const { pageX: x, pageY: y } = event.touches[0]

    if (touchStart.current) {
      const [deltaX, deltaY] = [x - touchStart.current.x, y - touchStart.current.y]
      if (Math.abs(deltaX) >= stepX) {
        touchStart.current = { x, y: touchStart.current.y }
      }
      if (Math.abs(deltaY) >= stepY) {
        touchStart.current = { x: touchStart.current.x, y }
      }
      listener(deltaX, deltaY)
    }
  })
  useEventListener('touchend', (event: TouchEvent) => {
    touchStart.current = null
  })
}

const App = () => {
  const [startDay, setStartDay] = React.useState(getDateWithoutTime(new Date()))
  const [shownDays, setDays] = React.useState(30)

  useEventListener('wheel', (event: WheelEvent) => {
    if (event.deltaY !== 0) {
      setStartDay(previousStartDay => addDays(previousStartDay, event.deltaY))
    }
    if (event.deltaX !== 0) {
      setDays(prevDays => {
        if (prevDays + event.deltaX < 1) {
          return 1
        }
        if (prevDays + event.deltaX > 100) {
          return 100
        }
        return prevDays + event.deltaX
      })
    }
  })
  useTouchDrag([30, 30], (x, y) => {
    if (Math.abs(x) > 0) {
      setDays(prevDays => {
        const deltaXSteps = Math.round(-x / 30)
        if (prevDays + deltaXSteps < 1) {
          return 1
        }
        if (prevDays + deltaXSteps > 100) {
          return 100
        }
        return prevDays + deltaXSteps
      })
    }
    if (Math.abs(y) > 30) {
      setStartDay(previousStartDay => addDays(previousStartDay, Math.round(-y / 30)))
    }
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Arbeitsbeginn</th>
          <th>Arbeitsende</th>
          <th>Pausen</th>
          <th>Arbeitszeit</th>
          <th>Notizen</th>
          <th>Werktag</th>
          <th>Wochenende</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: shownDays }).map((_, index) => {
          const date = addDays(startDay, index)

          const todaysHolidays = holidays
            .filter(([, isHoliday]) => isHoliday(date))
            .map(([name]) => name)

          const weekDay = date.getDay() as DayIndex

          const isWorkday = defaultWorkTimes[weekDay].length > 0 && todaysHolidays.length === 0
          const isWeekend = weekendDays.includes(weekDay)

          return (
            <tr
              key={`${date}`}
              style={isEqual(date, new Date()) ? { backgroundColor: '#343' } : undefined}
            >
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
        })}
      </tbody>
    </table>
  )
}

export default App
