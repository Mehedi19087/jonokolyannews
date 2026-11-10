import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ArchiveCalendar from "@/components/news/ArchiveCalendar";
import { publicationDate } from "@/lib/news-format";
export const metadata={title:"খবরের আর্কাইভ | জনকল্যাণ নিউজ"};
export default function ArchiveCalendarPage(){const today=publicationDate(new Date());return <><Header/><main className="site-width journal-category"><div className="journal-page-heading"><div><span>পুরোনো সংবাদ খুঁজুন</span><h1>খবরের আর্কাইভ</h1></div></div><ArchiveCalendar today={today}/></main><Footer/></>;}
