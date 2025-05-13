// components/FAQSection.tsx
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import api from '../../utills/api';

interface FAQ {
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [faqHeading, setFaqHeading] = useState<string>('');
  const [faqSubHeading, setFaqSubHeading] = useState<string>('');
  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: '', answer: '' },
  ]);

  // Fetch FAQ data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('admin/api/cms-faq');
        
        const { heading, subHeading, faq: fetchedFaqs } = response.data.faq;

        setFaqHeading(heading);
        setFaqSubHeading(subHeading);

        setFaqs(
          fetchedFaqs.map((item: any) => ({
            question: item.question || '',
            answer: item.answer || '',
          }))
        );
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        toast.error('Failed to load FAQs');
      }
    };

    fetchData();
  }, []);

  const onFaqChange = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const onAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const onRemoveFaq = (index: number) => {
    const updated = [...faqs];
    updated.splice(index, 1);
    setFaqs(updated);
  };

  const handleFaqSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.put('admin/api/cms-faq/update', {
        heading: faqHeading,
        subHeading: faqSubHeading,
        faq: faqs,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('FAQ save error:', error);
      toast.error('Failed to save FAQs');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">FAQ Section</h2>

      <form onSubmit={handleFaqSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Heading</label>
          <input
          required
            type="text"
            value={faqHeading}
            onChange={(e) => setFaqHeading(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sub Heading</label>
          <input
          required
            type="text"
            value={faqSubHeading}
            onChange={(e) => setFaqSubHeading(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        {faqs.map((faq, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">FAQ {index + 1}</h3>
              <button
                type="button"
                onClick={() => onRemoveFaq(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium">Question</label>
              <input
              required
                type="text"
                value={faq.question}
                onChange={(e) => onFaqChange(index, 'question', e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium">Answer</label>
              <textarea
              required
                rows={2}
                value={faq.answer}
                onChange={(e) => onFaqChange(index, 'answer', e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddFaq}
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add FAQ
        </button>

        <button
          type="submit"
          className="bg-dark text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
        >
          Save FAQs
        </button>
      </form>
    </div>
  );
};

export default Faq;
