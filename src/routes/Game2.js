import { useState, useEffect } from "react";
import axios from "axios";

// 오목
function Game2() {
  var col = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var [start, setStart] = useState(true);
  var [color, setColor] = useState(''); // 돌의 색상
  var [clickedCell, setClickedCell] = useState([]); // 클릭한 칸의 좌표

  const handleCellClick = (i,j) => {
    setClickedCell([...clickedCell, {i,j}])
    const newColor = color === 'black' ? 'white' : 'black';
    document.getElementById(`cell-${i}-${j}`).style.background = newColor;
    setColor(newColor);

    const encodeGameBoard = () => {
        return col.map((i) => {
           return col.map((j) => {
              {
                if(document.getElementById(`cell-${i}-${j}`).style.background == 'black' ){
                  return '1'
                }else if(document.getElementById(`cell-${i}-${j}`).style.background == 'white'){
                  return '2'
                }else{
                  return '0'
                }
              }
        }).join("")}).join("/");
    }

    // post로 데이터 보내기
    axios.post("https://jsonplaceholder.typicode.com/posts", { // 임시 서버
      color : newColor === 'black' ? '1' : '2',
      location : (i - 1) + "," + (j - 1),
      situation : encodeGameBoard(),
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log('실패');
    })
  }

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
          {col.map(function (i) {
            return (
              <tr key={i}>
                {col.map(function (j) {
                  return <td  
                            key={`${i}-${j}`}
                            id={`cell-${i}-${j}`}
                            className={ clickedCell.some(e => e.i === i && e.j === j) ? color : '' }
                            onClick={() => handleCellClick(i,j) }>
                    </td>;
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














