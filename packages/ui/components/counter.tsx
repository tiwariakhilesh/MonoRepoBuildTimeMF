import React, { useState } from "react";

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 style={{ marginBottom: "30px" }}>Counter App</h1>
      <button id="counter" type="button" onClick={() => setCount(count + 1)} style={{ background: "gray" }}>
        {count}
      </button></>

  );
};
