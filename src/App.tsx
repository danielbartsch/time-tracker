import React from "react";
import { workDays, weekendDays, holidays, weekDays, birthdays } from "./config";
import { addDays } from "./date";
import "./App.css";

const getDateWithoutTime = (datetime: Date) =>
  new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());

const padNumber = (
  number: number,
  pad: number,
  zeros: boolean = true
): string => {
  if (pad < 1) {
    return String(number);
  }
  const digits = Math.floor(Math.log10(number)) + 1;
  return `${Array.from({ length: pad - digits })
    .map(() => (zeros ? "0" : " "))
    .join("")}${number}`;
};

const Day = ({ value }: { value: Date }) => (
  <>
    {weekDays[value.getDay()]}. {padNumber(value.getFullYear(), 4)}-
    {padNumber(value.getMonth() + 1, 2)}-{padNumber(value.getDate(), 2)}
  </>
);

const DayStyle = ({
  children,
  date,
  todaysHolidays,
  todaysBirthdays,
}: {
  children: React.ReactNode;
  date: Date;
  todaysHolidays: Array<string>;
  todaysBirthdays: Array<[string, Date]>;
}) => {
  let textColor = undefined;
  if (todaysHolidays.length > 0) {
    textColor = "green";
  }
  if (todaysBirthdays.length > 0) {
    textColor = "#fc0";
  }

  let tooltip = todaysHolidays.slice();
  if (tooltip.length > 0 && todaysBirthdays.length > 0) {
    tooltip.push("und");
  }
  tooltip.push(
    ...todaysBirthdays.map(
      ([name, birthday]) =>
        `${name} (${date.getFullYear() - birthday.getFullYear()})`
    )
  );
  return (
    <code
      title={tooltip.join(" ")}
      style={textColor ? { color: textColor } : undefined}
    >
      {children}
    </code>
  );
};

const App = () => {
  const [startDay, setStartDay] = React.useState(
    getDateWithoutTime(new Date())
  );
  const [shownDays, setDays] = React.useState(30);

  React.useEffect(() => {
    return document.addEventListener("wheel", (event) => {
      if (event.deltaY !== 0) {
        setStartDay((previousStartDay) =>
          addDays(previousStartDay, event.deltaY)
        );
      }
      if (event.deltaX !== 0) {
        setDays((prevDays) => {
          if (prevDays + event.deltaX < 1) {
            return 1;
          }
          if (prevDays + event.deltaX > 100) {
            return 100;
          }
          return prevDays + event.deltaX;
        });
      }
    });
  }, []);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Feiertag</th>
            <th>Arbeit</th>
            <th>Wochenende</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: shownDays }).map((_, index) => {
            const date = addDays(startDay, index);

            const todaysHolidays = holidays
              .filter(([, isHoliday]) => isHoliday(date))
              .map(([name]) => name);

            const todaysBirthdays = birthdays.filter(
              ([, birthday]) =>
                birthday.getMonth() === date.getMonth() &&
                birthday.getDate() === date.getDate() &&
                date.getFullYear() >= birthday.getFullYear()
            );

            const isWorkday = workDays.includes(date.getDay());
            const isWeekend = weekendDays.includes(date.getDay());
            return (
              <tr key={`${date}`}>
                <td className="date">
                  <DayStyle
                    date={date}
                    todaysHolidays={todaysHolidays}
                    todaysBirthdays={todaysBirthdays}
                  >
                    <Day value={date} />
                  </DayStyle>
                </td>
                <td>{todaysHolidays ? "o" : undefined}</td>
                <td>
                  {isWorkday && todaysHolidays.length === 0 ? "o" : undefined}
                </td>
                <td>{isWeekend ? "o" : undefined}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
