import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import NewsState from "@/components/news/NewsState";
export const metadata={title:"English edition | Jonokollan News"};
export default function English(){return <><Header english/><main className="site-width" lang="en"><div className="journal-page-heading"><h1>English edition</h1></div><p className="edition-note">English reports are not available yet. Read the latest reports in Bengali.</p><NewsState title="বাংলা সংস্করণে সর্বশেষ সংবাদ পড়ুন"/></main><Footer/></>;}
