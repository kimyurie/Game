import { useState, useEffect } from "react";
import axios from "axios";

// 오목
function Game2() {
  var col = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var [start, setStart] = useState(true);
  var [color, setColor] = useState(""); // 돌의 색상
  var [clickedCell, setClickedCell] = useState([]); // 클릭한 칸의 좌표
  var [modal, setModal] = useState(false); // 다시하기 모달창
  var [alert, setAlert] = useState(false); // 3-3 금지 알림

  const handleCellClick = (i, j) => {
    setClickedCell([...clickedCell, { i, j }]);
    const newColor = color === "black" ? "white" : "black";
    document.getElementById(`cell-${i}-${j}`).style.background = newColor;
    setColor(newColor);

    const encodeGameBoard = () => {
      return col
        .map((i) => {
          return col
            .map((j) => {
              {
                if (
                  document.getElementById(`cell-${i}-${j}`).style.background == "black"
                ) {
                  return "1";
                } else if (
                  document.getElementById(`cell-${i}-${j}`).style.background == "white"
                ) { 
                  return "2";
                } else {
                  return "0";
                }
              }
            })
            .join("");
        })
        .join("/");
    };

    // post로 데이터 보내기
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        // 임시 서버
        color: newColor === "black" ? "1" : "2",
        location: i - 1 + "," + (j - 1),
        situation: encodeGameBoard(),
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log("실패");
      });
  };

  useEffect(() => {
    let a = setTimeout(() => {
      setStart(false);
    }, 3000);
    return () => {
      clearTimeout(a);
    };
  }, []);

  // 테이블 클릭할 때마다 3 - 3 경고창 나오고 2초후 사라지도록
  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
    }, 2000);
  }, [alert]);

  // 다시 하기 버튼 클릭 시 modal 값을 false로 변경
  const resetBtn = () => {
    setModal(false);
  };

  return (
    <>
      {modal ? <Modal reset={resetBtn}/> : null}
      {alert ? <Caution/> : null}

      {/* 오목판 */}
      {start == true ? <p>* 흑돌 먼저 시작 !</p> : <p>&nbsp;</p>}

      <table className="tb2" onClick={() => { 
        // return setModal(true)  // 임시로 table 클릭 시 다시하기 모달창 나오도록
        return setAlert(true) // 임시로 table 클릭 시 3-3 경고창 나오도록
      }}>
        <tbody>
          {col.map(function (i) {
            return (
              <tr key={i}>
                {col.map(function (j) {
                  return (
                    <td key={`${i}-${j}`} 
                      id={`cell-${i}-${j}`}
                      className={clickedCell.some((e) => e.i === i && e.j === j) ? color : "" }
                      onClick={() => handleCellClick(i, j)}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

{/* 다시 하기 모달창 */}
function Modal(props){
  return (
    <>
      <div style={{background: "white", width: "190px",height: "145px",borderRadius: "10px",padding: "20px", position: "absolute",margin: "20% 33%"}}>
        <p style={{ marginBottom: "40px", fontSize: "17px" }}>🏆️ 흰 돌 승리! </p>
        <button style={{  marginBottom: "30px", border: "none",height: "35px",background: "#3369fe", color: "#eee", borderRadius: "5px"}}
                onClick={props.reset}>다시 하기</button>
      </div>
    </>
  )
}

{/* 3-3 금지 알림 */}
function Caution(){
  return (
    <>
      <div style={{background:'rgb(252, 64, 64)', width:'100px', height:'50px', borderRadius:'10px',  position: "absolute",margin: "32% 40%"}}>
          <p style={{color:'white', fontSize: '13px'}}>3 - 3 입니다 !</p>
      </div>
    </>
  )
}


export default Game2;
