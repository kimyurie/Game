import { useEffect, useState } from "react";

// 지뢰찾기
function Game1() {
  var col = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var [count, setCount] = useState(60);

  useEffect(() => {
    let a = setInterval(function () {
      count -= 1;
      if (count >= 0) {
        setCount(count);
      }
    }, 1000);

    return () => {
      clearTimeout(a);
    };
  }, []);


  return (
    <div>
      <p>⏲ 남은 시간 : {count} 초</p>

      <table className="tb1" onClick={() => {}}>
        <tbody>
          {col.map((i) => {
            return (
              <tr>
                {col.map((j) => {
                  return (
                    <td
                      // 칸 누르면 흑 -> 백으로 바뀌게
                      // id={`cell-${i}-${j}`}
                      // onClick={() => {
                      //   document.getElementById(`cell-${i}-${j}`).style.background = 'white';
                      //   document.getElementById(`cell-${i}-${j}`).style.borderColor = 'grey'
                      // }}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Game1;
