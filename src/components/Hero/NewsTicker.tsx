import React from 'react';
import styles from '../../styles/NewsTicket.module.css'; // Import CSS module for styling
import newsTickerConfig from '@/config/newsTickerConfig.json';

const NewsTicker = () => {
  const { newsItems } = newsTickerConfig;

  return (
    <div className={styles.tickerWrap}>
      <div className={styles.ticker}>
        {newsItems.map((item, index) => (
          <div key={index} className={styles.tickerItem}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
