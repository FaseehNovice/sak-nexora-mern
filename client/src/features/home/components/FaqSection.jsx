import { Link } from 'react-router-dom';
import FAQList from '../../../components/FAQList.jsx';
import { FAQS } from '../../../content.js';
import { ArrowIcon } from './HomeIcons.jsx';

export default function FaqSection() {
  return (
    <section className="section section-light faq-section">
        <div className="wrap faq-wrap">
          <div data-reveal="up">
            <p className="eyebrow">Questions</p>
            <h2>Before you ask.</h2>
            <p className="muted">The things buyers ask us most. Anything else, just send us a message.</p>
            <Link to="/faqs" className="link-arrow">All FAQs <ArrowIcon /></Link>
          </div>
          <div data-reveal="up"><FAQList items={FAQS.slice(0, 4)} /></div>
        </div>
      </section>
  );
}
