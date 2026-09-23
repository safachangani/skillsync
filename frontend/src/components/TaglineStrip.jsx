import React from 'react';
import './taglineStrip.css';
import { HeartIcon } from '@heroicons/react/24/solid';

function TaglineStrip() {
  return (
    <div className="tagline-strip">
      <HeartIcon className="tagline-icon" />
      <span>A little help today. A stronger community tomorrow.</span>
      <HeartIcon className="tagline-icon" />
    </div>
  );
}

export default TaglineStrip;