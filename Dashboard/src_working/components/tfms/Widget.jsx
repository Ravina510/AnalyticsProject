// // Widget.js
// import React from "react";

// const Widget = ({ data }) => {
//   return (
//     <div>
//       <h2>Widget Component</h2>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           top: 0,
//           bottom: 0,
//           margin: "auto",
//         }}
//       >
//         {data.map((item, index) => (
//           <div
//             key={index}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               margin: "10px",
//               borderRadius: "5px",
//               width: "11rem",
//             }}
//           ><h3>Total Indents:</h3>
//             {item}
//             <br />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Widget;


import React from "react";

const Widget = ({ data,heading }) => {
  return (
    <div
      className="widget-container"
      style={{
        textAlign: "center",
      }}
    >
      {/* <h2>Widget Component</h2> */}
      <div
        className="widget-center"
        style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'center'
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px',
              borderRadius: '5px',
            }}
          >
            <h3>{heading}</h3>
            {item}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Widget;
