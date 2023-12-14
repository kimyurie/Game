import axios from "axios";
import { useEffect, useState } from "react";

// 지뢰찾기
function Game1() {
  let [situation, setSituation] = useState([]);
  let [result, setResult] = useState([]);
  let [timeReset,setTimeReset] = useState(false)
  useEffect(() => {
    axios
      .get("http://localhost:3001/data")
      .then((res) => {
        //result넣기
        const y = res.data.result.split("/").reverse();
        const arr2 = Array.from({ length: y }, () => []);
        y.forEach((e, idx) => {
          e = e.split("");
          arr2[idx] = [...e];
        });
        setResult(arr2);
        //situation을 배열로 쪼개고 뒤집음
        const x = res.data.situation.split("/").reverse();
        const arr = Array.from({ length: x.length }, () => []);
        x.forEach((e, idx) => {
          e = e.split("");
          e.forEach((i, index) => {
            if (i == "-") {
              arr[idx].push("-1");
            }
            if (i == 0) {
              arr[idx].push("0");
            }
          });
        });

        console.log("arr", arr);
        setSituation(arr);
      })
      .catch((err) => {
        console.log("실패");
      });
  }, []);

  let [col, setCol] = useState(
    Array.from({ length: 13 }, () => Array.from({ length: 13 }, () => -1))
  );
  let [count, setCount] = useState(60);
  let [color, setColor] = useState("");
  let [clickedCell, setClickedCell] = useState(new Set());
  // console.log(col)
  const handleCellClick = (i, j) => {
    const newColor = color === "" ? "white_line" : color;
    setColor(newColor);

    // 클릭한 셀의 좌표를 Set에 추가
    const newClickedCell = new Set(clickedCell);
    newClickedCell.add(`${i}-${j}`);
    setClickedCell(newClickedCell);

    // 눌려있는데 숫자 없으면 0, 안눌려있으면 -1(지뢰 상관없이)
    const encodeGameBoard = () => {
      return situation
        .map((a, i) => {
          return a
            .map((b, j) => {
              return newClickedCell.has(`${i}-${j}`) ? "0" : "-1";
            })
            .join("");
        })
        .join("/");
    };

    axios
      .post("http://localhost:3001/data", {
        // location: (13 - i) + "," + (j-1),
        location: i + "," + j,
        situation: encodeGameBoard(),
        result: result
          .map((e, idx) => {
            return e.join("");
          })
          .join("/"),
      })
      .then((res) => {
        setCol(
          res.data.situation
            .split("/")
            .reverse()
            .map((e) => e.split(""))
        );
        setTimeReset(true)
      })
      .catch((err) => {
        console.log("실패");
      });
  };
  const GV = {
    isPause: false,
    timer: null
}


  const startTimer = function(){
    GV.isPause = false;
    GV.timer = setInterval(function () {
      count -= 1;
      if (count >= 0) {
        setCount(count);
      }
    },1000)
}

const stopTimer = function(){
  clearInterval(GV.timer);
  GV.isPause = true;
}

  function timePlay() {
    
  }
  let a ;
  useEffect(() => {
    if(timeReset==false){
     startTimer()
    }

    if (timeReset==true) {
      setCount(60)
      stopTimer()
    }
  }, [timeReset]);

  return (
    <div>
      <p>⏲ 남은 시간 : {count} 초</p>

      <table className="tb1">
        <tbody>
          {situation.map((e, i) => {
            return (
              <tr>
                {e.map((_, j) => {
                  return (
                    <td
                      // 클릭한 칸이 흑 -> 백으로 바뀌게
                      id={`cell-${i}-${j}`}
                      className={clickedCell.has(`${12 - i}-${j}`) ? color : ""}
                      onClick={() => {
                        handleCellClick(12 - i, j);
                      }}
                      key={j}
                    >
                      {/* 흰색 칸 안에 숫자 1 표시  */}
                      {clickedCell.has(`${12 - i}-${j}`) &&
                        color === "white_line" && (
                          <div className="number" key={j}>
                            {result[i][j]}
                          </div>
                        )}
                    </td>
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
