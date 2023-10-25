import { useState, useEffect } from "react";

// 오목
function Game2() {
  var row = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var [count, setCount] = useState(60);
  var [start, setStart] = useState(true);

  useEffect(() => {
    let a = setTimeout(() => {
      setStart(false);
    }, 3000);
    return () => {
      clearTimeout(a);
    };
  }, []);

  return (
    <div>
      {start == true ? <p>* 흑돌 먼저 시작 !</p> : <p>&nbsp;</p>}

      <table className="tb2" onClick={() => {
      }}>
        <tbody>
          {row.map(function () {
            return (
              <tr>
                {row.map(function (a, i) {
                  return <td onClick={() => console.log(i)}></td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Game2;