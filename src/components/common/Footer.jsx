"use client";
import Link from "next/link";
import { useNews } from "@/components/news/NewsProvider";
import { Brand } from "./NewsElements";
import { categoryHref } from "@/lib/navigation";
import {
  FacebookIcon,
  YoutubeIcon,
  TwitterIcon,
  InstagramIcon,
} from "./SocialIcons";
export default function Footer() {
  const {categories} = useNews();
  return (
    <footer className="site-footer">
      <div className="site-width">
        <Brand />
        <nav className="footer-categories" aria-label="ফুটার বিভাগ">
          {categories.map((c) => (
            <Link key={c.id} href={categoryHref(c.slug)}>
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="footer-middle">
          <div>
            <p>অনুসরণ করুন</p>
            <div className="footer-social">
              {[
                ["Facebook", "https://facebook.com", FacebookIcon],
                ["YouTube", "https://youtube.com", YoutubeIcon],
                ["X", "https://x.com", TwitterIcon],
                ["Instagram", "https://instagram.com", InstagramIcon],
              ].map(([name, url, Icon]) => (
                <a
                  key={name}
                  href={url}
                  aria-label={name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div className="footer-editor">
            <p>সত্যের সন্ধানে, প্রতিদিন</p>
            <p>
              সম্পাদক ও প্রকাশক: <strong>ম. ম. রবি ডাকুয়া</strong>
            </p>
          </div>
        </div>
        <nav className="footer-links">
          <Link href="/about">আমাদের সম্পর্কে</Link>
          <Link href="/contact">যোগাযোগ</Link>
          <Link href="/advertise">বিজ্ঞাপন</Link>
          <Link href="/privacy">গোপনীয়তা নীতি</Link>
          <Link href="/terms">ব্যবহারের শর্তাবলি</Link>
          <Link href="/archive-calendar">আর্কাইভ</Link>
          <Link href="/newstoday">আজকের সংবাদ</Link>
          <Link href="/print">প্রিন্ট সংস্করণ</Link>
        </nav>
        <p className="copyright">
          স্বত্ব © ২০২৬ রবি ডাকুয়া{" "}
          <span>সম্পাদক ও প্রকাশক: ম. ম. রবি ডাকুয়া</span>
        </p>
      </div>
    </footer>
  );
}
