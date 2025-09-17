"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";

export default function Footer() {
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
    isOpen: boolean;
  }>({ title: "", content: "", isOpen: false });

  function openModal(title: string, content: string) {
    setModalContent({ title, content, isOpen: true });
  }

  function closeModal() {
    setModalContent({ ...modalContent, isOpen: false });
  }
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Hub
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Creating memorable experiences through seamless event management.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    const faqSection = document.getElementById("faq");
                    if (faqSection) {
                      faqSection.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/#faq";
                    }
                  }}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <button
                  onClick={function () {
                    openModal(
                      "Privacy Policy",
                      "Our privacy policy outlines how we collect, use, and protect your personal information.\n\nWe collect information when you create an account, book events, or interact with our platform. This includes your name, email, payment details, and usage data.\n\nYour data is used to provide our services, process transactions, improve user experience, and send relevant communications.\n\nWe implement industry-standard security measures to protect your information and never sell your personal data to third parties.\n\nYou have the right to access, correct, or delete your personal information at any time.\n\nFor more detailed information about our data practices, please contact our Data Protection Officer at privacy@eventhub.com."
                    );
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={function () {
                    openModal(
                      "Terms of Service",
                      "Our terms of service define the rules and guidelines for using our platform.\n\nBy creating an account, you agree to provide accurate information and are responsible for maintaining the security of your credentials.\n\nEvent organizers must ensure their event content complies with our community guidelines and applicable laws.\n\nUsers may not engage in any activity that disrupts our services or compromises security.\n\nWe reserve the right to suspend or terminate accounts that violate these terms.\n\nEvent Hub is not responsible for disputes between organizers and attendees, though we provide tools to facilitate resolution.\n\nThese terms were last updated on June 1, 2023. For the complete terms document, please visit eventhub.com/terms."
                    );
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={function () {
                    openModal(
                      "Help Center",
                      "Our help center provides comprehensive support for all your Event Hub needs.\n\nTroubleshooting Guides: Step-by-step solutions for common issues with event creation, ticket management, and payments.\n\nVideo Tutorials: Visual guides for navigating our platform and utilizing all features effectively.\n\nLive Support: Connect with our support team via chat Monday-Friday, 9am-6pm EST.\n\nKnowledge Base: Extensive articles covering all aspects of event management.\n\nCommunity Forum: Connect with other event organizers to share tips and best practices.\n\nFor immediate assistance, contact our support team at support@eventhub.com or call our helpline at (800) 123-4567."
                    );
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <address className="not-italic text-gray-600 dark:text-gray-400">
              <p>123 Event Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">Email: info@eventhub.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Event Hub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modal */}
      {modalContent.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              {modalContent.title}
            </h3>
            <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              <p>{modalContent.content}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
