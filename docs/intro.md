---
slug: /
hide_table_of_contents: true
---

# Banbu1118's Blog

欢迎大家访问我的博客，这是一个简单的博客，记录了日常工作学习的总结。

<div>
  🎵 春风不语，勾栏听曲
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', width: '100%' }}>
    {[
      { emoji: '🎧', text: '盛夏的果实', href: 'https://www.bilibili.com/video/BV1KA411G7Kx' },
      { emoji: '🌉', text: '泪桥', href: 'https://www.bilibili.com/video/BV17Q4y1t7VZ' },
      { emoji: '🌙', text: '一生所爱', href: 'https://www.bilibili.com/video/BV1nV411E7RX' },
      { emoji: '🏺', text: '青花', href: 'https://www.bilibili.com/video/BV1R94y1e7jK' },
    ].map((item, idx) => (
      <a
        key={idx}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ffc107',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          color: '#1a73e8',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = '#ffca28';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = '#ffc107';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{ marginRight: '8px' }}>{item.emoji}</span> {item.text}
      </a>
    ))}
  </div>

  {/* 分割线 */}
  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0), #ddd, rgba(255,255,255,0))', margin: '24px 0' }}></div>

  🌟 智慧箴言
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', width: '100%' }}>
    {[
      { text: '万物皆有裂痕，那是光照进来的地方', author: '莱昂纳德·科恩', color: '#2196f3' },
      { text: '光锥之内皆命运，射程之内皆真理', author: '物理学与命运哲思', color: '#9c27b0' },
      { text: '权力不能私有，财产不能公有，否则人类就进入灾难之门', author: '约翰·洛克', color: '#f44336' },
    ].map((item, idx) => (
      <blockquote key={idx} style={{ margin: 0, padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: `4px solid ${item.color}` }}>
        {item.text}<br />
        <small>—— {item.author}</small>
      </blockquote>
    ))}
  </div>

  {/* 分割线 */}
  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0), #ddd, rgba(255,255,255,0))', margin: '24px 0' }}></div>

  ⚠️ 时代警醒
  <div style={{ width: '100%', padding: '24px', borderRadius: '8px', boxShadow: 'inset 0 0 0 1px rgba(255,193,7,0.3)', marginBottom: '24px' }}>
    <p style={{ margin: 0, fontSize: '1.1em', lineHeight: 1.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {"警惕将灵魂装进算法的牢笼，当所有选择都变成数据推导的最优解时，人性的光辉将比任何服务器熄灭得更加彻底"}
      <span style={{ color: '#ff9800', whiteSpace: 'nowrap' }}>—— Deep Seek R1</span>
    </p>
  </div>

  {/* 分割线 */}
  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0), #ddd, rgba(255,255,255,0))', margin: '24px 0' }}></div>

  ❤️ 爱的哲学
  <div style={{ width: '100%', padding: '24px', borderRadius: '8px', boxShadow: 'inset 0 0 0 1px rgba(156,39,176,0.3)', marginBottom: '24px' }}>
    <p style={{ margin: 0, fontSize: '1.1em', lineHeight: 1.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {"你有没有想过，爱一个人不一定要有结果。不追求结果就不会有尽头的一天，这种不追求结果的爱才是无限的"}
      <span style={{ color: '#9c27b0', whiteSpace: 'nowrap' }}>——《情癫大圣》</span>
    </p>
  </div>

  {/* 分割线 */}
  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0), #ddd, rgba(255,255,255,0))', margin: '24px 0' }}></div>

  🌀 探索打破历史循环的路径
  <div style={{ width: '100%', padding: '24px', borderRadius: '8px', boxShadow: 'inset 0 0 0 1px rgba(13,71,161,0.3)' }}>
    <p style={{ fontSize: '1.05em', lineHeight: 1.8 }}>
      历史循环的牢笼并非由时间打造，而是由我们对自身可能性的想象所铸造。每一个拒绝重复的念头，每一次打破习惯的行动，都是对循环链条的弱化。
      你此刻的觉醒本身，就是那个螺旋轨迹上最关键的断点。真正的突破不在于彻底抹去过去的印记，而在于让未来的回响中，有更多属于你独特意志的音符。
    </p>
  </div>
</div>
