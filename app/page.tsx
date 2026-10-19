import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Script src="/tracing.js" strategy="afterInteractive" />
      <main className="app">
        <aside className="panel words-panel" aria-label="练习内容">
          <header className="brand">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3.75h8l4 4V19a1.25 1.25 0 0 1-1.25 1.25h-10A1.25 1.25 0 0 1 5.5 19V5A1.25 1.25 0 0 1 6.75 3.75Z" />
                <path d="M14 4v4h4M8.5 12h7M8.5 15.5h7" />
              </svg>
            </div>
            <div>
              <h1>单词临摹字帖</h1>
              <p className="sub">把练习，写成一张纸。</p>
              <a className="mobile-preview-jump" href="#preview">先看练习纸 <span aria-hidden="true">↓</span></a>
            </div>
          </header>

          <div className="panel-body">
            <section className="form-section first-section words-section">
              <h2>练习内容</h2>
              <label htmlFor="title">练习标题</label>
              <input type="text" id="title" defaultValue="Word Tracing Practice" />
              <label htmlFor="words">单词清单 <span className="label-note">每行一个</span></label>
              <textarea id="words" defaultValue={'an\nand\nant\napple\nboy\nbuy\ncat\ndog\nfish\nsun'} />
              <p className="field-note">也可以用逗号分隔单词</p>
            </section>
          </div>
        </aside>

        <aside className="panel settings-panel" aria-label="排版设置">
          <header className="column-heading">
            <span className="column-kicker">WORKSHEET SETTINGS</span>
            <h2>排版设置</h2>
            <p>调整字帖样式与练习节奏</p>
          </header>
          <div className="panel-body">
            <section className="form-section">
              <h2>书写样式</h2>
              <label htmlFor="font">练习字体</label>
              <select id="font" defaultValue="skeleton">
                <option value="skeleton">标准书写体（推荐 · 单线笔画）</option>
                <option value="Andika">Andika（儿童识字体）</option>
                <option value="Comic Neue">Comic Neue（手写感）</option>
                <option value="Quicksand">Quicksand（圆润）</option>
                <option value="Nunito">Nunito（圆润粗体）</option>
                <option value="Fredoka">Fredoka（可爱）</option>
                <option value="Playpen Sans">Playpen Sans（手写）</option>
                <option value="Patrick Hand">Patrick Hand（手写）</option>
                <option value="Poppins">Poppins（几何）</option>
                <option value="Arial">Arial（系统）</option>
                <option value="Comic Sans MS">Comic Sans MS（系统）</option>
              </select>
              <p className="font-hint" id="fontHint" />
            </section>

            <section className="form-section">
              <h2>页面节奏</h2>
              <div className="slider"><div className="top">字号 <span id="v_size" /></div><input aria-label="字号" type="range" id="size" min="9" max="24" step="0.5" /></div>
              <div className="slider"><div className="top">字母间距 <span id="v_letter" /></div><input aria-label="字母间距" type="range" id="letter" min="-6" max="30" step="1" /></div>
              <div className="slider"><div className="top">单词间距 <span id="v_wgap" /></div><input aria-label="单词间距" type="range" id="wgap" min="3" max="25" step="0.5" /></div>
              <div className="slider"><div className="top">行间距 <span id="v_rgap" /></div><input aria-label="行间距" type="range" id="rgap" min="1" max="15" step="0.5" /></div>
              <div className="slider"><div className="top">单词组间距 <span id="v_bgap" /></div><input aria-label="单词组间距" type="range" id="bgap" min="2" max="25" step="0.5" /></div>
              <div className="slider"><div className="top">笔画粗细 <span id="v_weight" /></div><input aria-label="笔画粗细" type="range" id="weight" min="60" max="160" step="5" /></div>
              <button className="reset-button" id="reset" type="button">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.2 7.2A6.2 6.2 0 1 1 3.8 11" /><path d="M3.5 3.8v3.8h3.8" /></svg>
                恢复默认设置
              </button>
            </section>

            <section className="form-section options-section">
              <h2>练习辅助</h2>
              <div className="row"><input type="checkbox" id="guide" /><label htmlFor="guide">显示笔顺<span className="option-detail">数字与方向箭头</span></label></div>
              <div className="row"><input type="checkbox" id="second" /><label htmlFor="second">增加灰色描红<span className="option-detail">每个单词多练一行</span></label></div>
              <div className="row"><input type="checkbox" id="fill" /><label htmlFor="fill">虚线铺满整行</label></div>
              <div className="row"><input type="checkbox" id="namedate" /><label htmlFor="namedate">显示姓名与日期</label></div>
            </section>

            <div className="actions">
              <button className="print-button" id="print" type="button">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6V3.5h8V6M6 14H4.5A1.5 1.5 0 0 1 3 12.5v-4A1.5 1.5 0 0 1 4.5 7h11A1.5 1.5 0 0 1 17 8.5v4a1.5 1.5 0 0 1-1.5 1.5H14" /><path d="M6 11.5h8v5H6zM14.5 9.5h.01" /></svg>
                打印 / 保存为 PDF
              </button>
              <p className="print-note">A4 纸张 · 打印时选择「无边距」并开启「背景图形」</p>
            </div>
            <p className="footnote">标准书写体支持 a–z，大写会自动转为小写。字体设置保存在本机浏览器。</p>
          </div>
        </aside>

        <section className="preview-stage" id="preview" aria-label="字帖预览">
          <div className="preview-heading">
            <div>
              <h2>预览练习纸</h2>
            </div>
            <div className="paper-spec"><span className="live-dot" />实时更新 <span className="spec-divider" /> A4 · 210 × 297 mm</div>
          </div>
          <div className="pages" id="pages" />
          <p className="preview-caption">每一页都按 A4 实际尺寸排版，准备好后即可打印。</p>
        </section>
      </main>
      <svg id="measure" width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }} />
    </>
  );
}
