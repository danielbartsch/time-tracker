import React from 'react'
import { addDays, dateString } from './date'
import { DateRow, fetchWorkTimes } from './DateRow'

const getDateWithoutTime = (datetime: Date) =>
  new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate())

const useEventListener = (event: string, listener: (event: any) => void) => {
  React.useEffect(() => {
    document.addEventListener(event, listener)
    return () => {
      document.removeEventListener(event, listener)
    }
  }, [event, listener])
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
  const savedWorkTimes = fetchWorkTimes()

  useEventListener('wheel', (event: WheelEvent) => {
    if (event.deltaY !== 0) {
      setStartDay(previousStartDay =>
        addDays(
          previousStartDay,
          event.deltaY > 0 ? Math.min(event.deltaY, shownDays) : Math.max(event.deltaY, -shownDays)
        )
      )
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
      const deltaY = Math.round(-y / 30)
      setStartDay(previousStartDay =>
        addDays(
          previousStartDay,
          deltaY > 0 ? Math.min(deltaY, shownDays) : Math.max(deltaY, -shownDays)
        )
      )
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
          return (
            <DateRow
              key={dateString(date)}
              date={date}
              workTime={savedWorkTimes[dateString(date)]}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default App
