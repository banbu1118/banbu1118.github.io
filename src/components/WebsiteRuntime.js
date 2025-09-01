// src/components/WebsiteRuntime.js
import React, { useState, useEffect } from 'react';

// 设置网站上线时间
const LAUNCH_DATE = new Date('2023-10-18T05:20:00');

// 计算精确年/月/日/时/分/秒差
function formatDuration(startDate, endDate) {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();
  let hours = endDate.getHours() - startDate.getHours();
  let minutes = endDate.getMinutes() - startDate.getMinutes();
  let seconds = endDate.getSeconds() - startDate.getSeconds();

  // 处理负值进位
  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // 获取上个月天数
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    days += prevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return `${years}年 ${months}月 ${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;
}

export default function WebsiteRuntime() {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const updateDuration = () => {
      const now = new Date();
      setDuration(formatDuration(LAUNCH_DATE, now));
    };

    updateDuration();
    const timer = setInterval(updateDuration, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>{duration}</span>;
}
