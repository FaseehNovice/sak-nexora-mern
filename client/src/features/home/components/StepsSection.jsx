import { Link } from 'react-router-dom';
import { STEPS } from '../../../content.js';
import { ArrowIcon } from './HomeIcons.jsx';

export default function StepsSection() {
  return (
    <section className="section section-light steps-section">
        <div className="wrap">
          <div className="section-head" data-reveal="up">
            <div><p className="eyebrow">How ordering works</p><h2>From catalogue to quote in three steps.</h2></div>
          </div>
          <ol className="steps">
            {STEPS.map((item, index) => <li data-reveal="up" key={item.t}><span className="step-number">Step {index + 1}</span><h3>{item.t}</h3><p>{item.d}</p></li>)}
          </ol>
          <p className="center"><Link className="btn" to="/catalogue">Start your list <ArrowIcon /></Link></p>
        </div>
      </section>
  );
}
