{/* <div classname="row">
{" "}

<div
  classname="col-sm-6"
  style={{
    float: "left",
    width: "49%",
    zIndex: "0",
    position: "relative",
  }}
>
  <p
    style={{
      fontSize: "20px",
      backgroundColor: "black",
      color: "white",
    }}
  >
    <strong>BCU2 A</strong>
  </p>
  {data.map((graph, index) => (
        <div style={{ height: "500px", width: "900px" }} key={index}>
          {" "}
          <Line {...config(index)} />
        </div>
      ))}
{/* </div> */}

// <div
//   classname="col-sm-6"
//   style={{
//     float: "right",
//     width: "49%",
//     zIndex: "0",
//     position: "relative",
//   }}
// >
//   <p
//     style={{
//       fontSize: "20px",
//       backgroundColor: "black",
//       color: "white",
//     }}
//   >
//     <strong>BCU2 B</strong>
//   </p>
//   {data.map((graph, index) => (
//         <div style={{ height: "500px", width: "900px" }} key={index}>
//           {" "}
//           <Line {...config(index)} />
//         </div>
//       ))}
// </div>
// </div> */}