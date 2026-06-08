import L from 'leaflet'

export const pickupIcon = new L.DivIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        filter:drop-shadow(0 6px 18px rgba(0,0,0,.22));
      ">
        
        <div style="
          background:#0a0a0a;
          color:#fff;
          padding:5px 14px;
          border-radius:100px;
          font-size:10px;
          font-weight:800;
          letter-spacing:.14em;
          text-transform:uppercase;
          white-space:nowrap;
          box-shadow:0 2px 12px rgba(0,0,0,.25);
        ">
          PICKUP
        </div>
  
        <div style="
          width:2px;
          height:12px;
          background:#0a0a0a;
          opacity:.4;
        "></div>
  
        <div style="
          width:14px;
          height:14px;
          background:#16a34a;
          border-radius:50%;
          border:3px solid #fff;
          box-shadow:
            0 0 0 2px rgba(0,0,0,.15),
            0 3px 10px rgba(0,0,0,.3);
        "></div>
      </div>
    `,
    iconSize: [100, 50],
    iconAnchor: [50, 50],
  });
   export const dropIcon = new L.DivIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        filter:drop-shadow(0 6px 18px rgba(0,0,0,.22));
      ">
        
        <div style="
          background:#0a0a0a;
          color:#fff;
          padding:5px 14px;
          border-radius:100px;
          font-size:10px;
          font-weight:800;
          letter-spacing:.14em;
          text-transform:uppercase;
          white-space:nowrap;
          box-shadow:0 2px 12px rgba(0,0,0,.25);
        ">
          DROP
        </div>
  
        <div style="
          width:2px;
          height:12px;
          background:#0a0a0a;
          opacity:.4;
        "></div>
  
        <div style="
          width:14px;
          height:14px;
          background:#ef4444;
          border-radius:50%;
          border:3px solid #fff;
          box-shadow:
            0 0 0 2px rgba(0,0,0,.15),
            0 3px 10px rgba(0,0,0,.3);
        "></div>
      </div>
    `,
    iconSize: [100, 50],
    iconAnchor: [50, 50],
  });

export const driverIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      filter:drop-shadow(0 6px 18px rgba(0,0,0,.22));
    ">
      
      <div style="
        background:#2563eb;
        color:#fff;
        padding:5px 14px;
        border-radius:100px;
        font-size:10px;
        font-weight:800;
        letter-spacing:.14em;
        text-transform:uppercase;
        white-space:nowrap;
        box-shadow:0 2px 12px rgba(0,0,0,.25);
      ">
        DRIVER
      </div>

      <div style="
        width:2px;
        height:12px;
        background:#2563eb;
        opacity:.5;
      "></div>

      <div style="
        width:18px;
        height:18px;
        background:#2563eb;
        border-radius:50%;
        border:4px solid #fff;
        box-shadow:
          0 0 0 2px rgba(37,99,235,.25),
          0 3px 10px rgba(0,0,0,.3);
        animation:pulse 1.5s infinite;
      "></div>
    </div>

    <style>
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow:
            0 0 0 0 rgba(37,99,235,.5),
            0 3px 10px rgba(0,0,0,.3);
        }
        70% {
          transform: scale(1.15);
          box-shadow:
            0 0 0 12px rgba(37,99,235,0),
            0 3px 10px rgba(0,0,0,.3);
        }
        100% {
          transform: scale(1);
        }
      }
    </style>
  `,
  iconSize: [100, 60],
  iconAnchor: [50, 60],
});