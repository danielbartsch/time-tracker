import React from "react";
import { workDays, weekDays } from "./config";
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

const addDays = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const App = () => {
  const [startDay, setStartDay] = React.useState(
    getDateWithoutTime(new Date())
  );
  const [shownDays, setDays] = React.useState(10);

  React.useEffect(() => {
    return document.addEventListener("wheel", (event) => {
      if (event.deltaY !== 0) {
        setStartDay((previousStartDay) =>
          addDays(previousStartDay, event.deltaY)
        );
      }
      if (event.deltaX !== 0) {
        setDays((prevDays) =>
          prevDays + event.deltaX < 1 ? 1 : prevDays + event.deltaX
        );
      }
    });
  }, []);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: shownDays }).map((_, index) => {
            const day = addDays(startDay, index);
            return (
              <tr key={`${day}`}>
                <td className="date">
                  <code>
                    <Day value={day} />
                  </code>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
