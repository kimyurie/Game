import { useState, useEffect} from "react";
import axios from "axios";

// 오목
function Game2() {
  const col = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const [start, setStart] = useState(true);
  const [color, setColor] = useState(""); // 돌의 색상
  const [clickedCell, setClickedCell] = useState([]); // 클릭한 칸의 좌표
  const [modal_wht, setModal_wht] = useState(false); // 다시하기 모달창 흰
  const [modal_blk, setModal_blk] = useState(false); // 다시하기 모달창 흑
  const [alert, setAlert] = useState(false); // 3-3 금지 알림
  const [table, setTable] = useState(false); // 오목판 전체 상태

  const handleCellClick = (i, j) => {
    const newColor = color === "black" ? "white" : "black";

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

    console.log(newColor === "black" ? "1" : "2");
    console.log((i -1) + "," + (j-1));
    console.log(encodeGameBoard());

    // post로 데이터 보내기
    axios
      .post("http://15.164.164.15:8080/omok/place", { // 서버 수정 
        // 임시 서버
        color: newColor === "black" ? "1" : "2",
        location: `${i - 1},${j - 1}`,
        situation: encodeGameBoard(),
      })
      .then((res) => {
        // 클릭된 셀의 위치를 {{i:1, j:2}, {i:2,j:1}...} 형식으로 누적되 저장
        setClickedCell([...clickedCell, { i, j }]);
        // 현재 클릭된 셀의 돌 색을 변경
        document.getElementById(`cell-${i}-${j}`).style.background = newColor;
       // 현재 클릭된 돌의 색상을 변경
        setColor(newColor);

        //  if (res.data == '33'){
        //   // setAlert(true)
        // } 

        // 각 돌 승리시 승리 모달창 띄움
        if(res.data == '백돌 승리입니다'){
          setModal_wht(true);
        }
        if(res.data == '흑돌 승리입니다') {
          setModal_blk(true);
        }

        console.log(res.data);

      })
      .catch((err) => {
        console.log("실패");
      });
  };

  useEffect(() => {
    const a = setTimeout(() => {
      setStart(false);
    }, 3000);
    return () => clearTimeout(a);
  }, []);


  // // 테이블 클릭할 때마다 3 - 3 경고창 나오고 2초후 사라지도록
  // useEffect(() => {
  //   setTimeout(() => {
  //     setAlert(false);

  //     let count = 0;
  //     // 클릭할때마다 돌의 색상을 투명하게 바꾸기
  //     if (clickedCell.length > 0) {
  //       let { i, j } = clickedCell[clickedCell.length-1];
  //       document.getElementById(`cell-${i}-${j}`).style.backgroundColor = 'transparent';
  //       count++;
  //     }
  //   }, 2000);
  // }, [alert, clickedCell]);




  // 다시 하기 버튼 클릭 시 modal 값을 false로 변경
  const resetBtn = () => {
    setModal_wht(false);
    setModal_blk(false);
    setTable(true);
  };

  return (
    <>
      {modal_wht ? <Modal_wht reset={resetBtn}/> : null}
      {modal_blk ? <Modal_blk reset={resetBtn}/> : null}

      {alert ? <Caution/> : null}

      {start == true ? <p>* 흑돌 먼저 시작 !</p> : <p>&nbsp;</p>}

      {table ? window.location.reload('/game/2'): ''}
      
      <table className="tb2" onClick={() => { 
        // return setAlert(true) // 임시로 table 클릭 시 3-3 경고창 나오도록
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

{/* 다시 하기 모달창 - 백 돌 승리시 */}
function Modal_wht(props){
  return (
    <>
      <div style={{background: "white", width: "190px",height: "145px",borderRadius: "10px",padding: "20px", position: "absolute",margin: "20% 33%"}}>
        <p style={{ marginBottom: "40px", fontSize: "17px" }}>🏆️ 백 돌 승리! </p>
        <button style={{  marginBottom: "30px", border: "none",height: "35px", background: "#3369fe", color: "#eee", borderRadius: "5px"}}
                onClick={props.reset}>다시 하기</button>
      </div>
    </>
  )
}
{/* 다시 하기 모달창 - 흑 돌 승리시 */}
function Modal_blk(props){
  return (
    <>
      <div style={{background: "white", width: "190px",height: "145px",borderRadius: "10px",padding: "20px", position: "absolute",margin: "20% 33%"}}>
        <p style={{ marginBottom: "40px", fontSize: "17px" }}>🏆️ 흑 돌 승리! </p>
        <button style={{  marginBottom: "30px", border: "none",height: "35px", background: "#3369fe", color: "#eee", borderRadius: "5px"}}
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
