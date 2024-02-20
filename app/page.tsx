"use client";
import { useState, useEffect } from "react";
import GameComponent from "@/components/GameComponent";
import LeaderBoardComponent from "@/components/LeaderBoardComponent";
import  GiftComponent from "@/components/GiftComponent";

export default function Home() {
  return (
    <div>
      <div className="" style={{ position: "relative" }}>        
      <div className="" style={{ position: "absolute", top: 0, left: 0 }}>
          <GiftComponent />
        </div>
        <div className="" style={{ position: "absolute", top: 0, left: 0 }}>
          <LeaderBoardComponent />
        </div>
        <div className="" style={{ position: "absolute", top: 0, left: 0 }}>
          <GameComponent />
        </div>

      </div>
    </div>
  );
}
