"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { divisions } from "@/data/locations";
export default function RegionFilter() {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const router = useRouter();
  const selected = divisions.find((d) => d.name === division);
  return (
    <form
      className="region-filter"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(
          `/category/samagrabangladesh?${new URLSearchParams({ division, district })}`,
        );
      }}
    >
      <h3>আমার এলাকার খবর</h3>
      <select
        aria-label="বিভাগ"
        value={division}
        onChange={(e) => {
          setDivision(e.target.value);
          setDistrict("");
        }}
      >
        <option value="">বিভাগ</option>
        {divisions.map((d) => (
          <option key={d.name}>{d.name}</option>
        ))}
      </select>
      <select
        aria-label="জেলা"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        disabled={!division}
      >
        <option value="">জেলা</option>
        {selected?.districts.map((d) => (
          <option key={d.name}>{d.name}</option>
        ))}
      </select>
      <button className="blue-button">খুঁজুন</button>
    </form>
  );
}
