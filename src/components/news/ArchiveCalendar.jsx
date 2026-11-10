"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { publicationDate } from "@/lib/news-format";
export default function ArchiveCalendar({today}) {
  const [year,setYear]=useState(Number(today.slice(0,4)));
  const [month,setMonth]=useState(Number(today.slice(5,7))-1);
  const start=new Date(year,month,1).getDay();
  const days=new Date(year,month+1,0).getDate();
  function move(delta){const d=new Date(year,month+delta,1);setYear(d.getFullYear());setMonth(d.getMonth());}
  const nextMonth=`${year}-${String(month+1).padStart(2,"0")}`>=today.slice(0,7);
  return <div className="calendar-panel"><div className="calendar-heading"><button onClick={()=>move(-1)} aria-label="আগের মাস"><ChevronLeft size={20}/></button><h2>{new Date(year,month,1).toLocaleDateString("bn-BD",{month:"long",year:"numeric"})}</h2><button onClick={()=>move(1)} disabled={nextMonth} aria-label="পরের মাস"><ChevronRight size={20}/></button></div><div className="news-calendar-grid">{["রবি","সোম","মঙ্গল","বুধ","বৃহস্পতি","শুক্র","শনি"].map((d)=><span key={d}>{d}</span>)}{Array.from({length:start},(_,i)=><span key={`blank-${i}`}/>)}{Array.from({length:days},(_,i)=>{const date=publicationDate(new Date(`${year}-${String(month+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}T12:00:00+06:00`));return date>today?<button key={date} disabled>{(i+1).toLocaleString("bn-BD")}</button>:<Link key={date} data-today={date===today} href={`/archive?date=${date}`} aria-label={`${(i+1).toLocaleString("bn-BD")} তারিখের সংবাদ`}>{(i+1).toLocaleString("bn-BD")}</Link>;})}</div><p className="calendar-note">তারিখ নির্বাচন করে সেই দিনের প্রকাশিত সংবাদ পড়ুন।</p></div>;
}
