import React, { useState } from "react";
import rabbitImg from "../assets/rabbit.svg";
import cheetahImg from "../assets/cheetah.svg";
import tortoiseImg from "../assets/tortoise.svg";
import meterlineimg from "../assets/meterline.svg";
import dotimg from "../assets/dott.svg";

const SpeedSelector = ({ onSelect, selected: propSelected }) => {
  const [localSelected, setLocalSelected] = useState("Slow");
  const selected = propSelected !== undefined ? propSelected : localSelected;

  const handleSelect = (value) => {
    if (propSelected === undefined) setLocalSelected(value);
    if (onSelect) onSelect(value);
  };

  const getRotationAndFill = () => {
    switch (selected) {
      case "Slow":
        return { needleRotate: -45, fillRotate: -137 };
      case "Medium":
        return { needleRotate: 0, fillRotate: -90 };
      case "Fast":
        return { needleRotate: 45, fillRotate: 0 };
      default:
        return { needleRotate: -45, fillRotate: -137 };
    }
  };

  const { needleRotate, fillRotate } = getRotationAndFill();

  return (
    <div
      style={{
        position: "absolute",
        right: "20px",
        top: "59%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        padding: "-5px 5px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80px",
          height: "40px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: "40px",
            borderTopRightRadius: "40px",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            background:
              "conic-gradient(from -90deg at 50% 100%, orange 0deg, orange 180deg, white 180deg, white 360deg)",
            borderTopLeftRadius: "40px",
            borderTopRightRadius: "40px",
            transform: `rotate(${fillRotate}deg)`,
            transformOrigin: "50% 100%",
            transition: "transform 0.4s ease",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "0px",
            width: "100%",
            height: "100%",
            borderTopLeftRadius: "40px",
            borderTopRightRadius: "40px",
            backgroundColor: "#eeeff1",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "12px",
            width: "calc(100% - 25px)",
            height: "calc(100% - 8px)",
            borderTopLeftRadius: "40px",
            borderTopRightRadius: "40px",
            backgroundColor: "#fff",
            zIndex: 2,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            left: "50%",
            transform: `translateX(-50%) rotate(${needleRotate}deg)`,
            transformOrigin: "bottom center",
            transition: "transform 0.4s ease",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={meterlineimg}
            alt="needle"
            style={{ width: "5px", height: "30px" }}
          />
          <img
            src={dotimg}
            alt="dot"
            style={{ width: "10px", marginTop: "-2px" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          width: "100%",
        }}
      >
        {[
          { label: "Slow", img: tortoiseImg },
          { label: "Medium", img: rabbitImg },
          { label: "Fast", img: cheetahImg },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => handleSelect(item.label)}
            style={{
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              borderRadius: "16px",
              padding: "10px 0",
              background:
                selected === item.label
                  ? "linear-gradient(180deg, #fff3e0, #ffe0b2)"
                  : "transparent",
              transition: "0.3s",
            }}
          >
            <img
              src={item.img}
              alt={item.label}
              style={{ width: "34px", marginBottom: "5px" }}
            />
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: selected === item.label ? "#333" : "#555",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeedSelector;
