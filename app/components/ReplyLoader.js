"use client";
import React from "react";

function ReplyLoading() {
  return (
    <div className="py-[20px] px-[30px] rounded-[12px] border border-borderColor p-6 flex flex-row gap-4">
      <div
        style={{ alignItems: "flex-start" }}
        className="holder-avatar ai-avatars"
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "white",
            marginTop: "7px",
          }}
          className="user-avatar"
        >
          <img src="https://res.cloudinary.com/cashaam/image/upload/v1685499319/icons/sparkle_resting_v2_1ff6f6a71f2d298b1a31_khotyb.gif" />
        </div>
      </div>

      <div style={{ marginTop: "22px" }} className="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default ReplyLoading;
