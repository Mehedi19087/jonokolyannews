import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="site-width empty-state">
        <p>৪০৪</p>
        <h1>পাতাটি পাওয়া যায়নি</h1>
        <p>লিংকটি সঠিক কি না দেখুন অথবা সর্বশেষ সংবাদে ফিরে যান।</p>
        <Link className="outline-button" href="/">
          প্রচ্ছদে ফিরুন
        </Link>
      </main>
      <Footer />
    </>
  );
}
