/**
 * FluentDialog 模块
 * 一个基于 Windows 11 Fluent Design 风格的模态弹窗组件。
 * 支持深色模式自适应、毛玻璃效果、自定义标题/内容/回调，仅通过“确定”按钮关闭。
 * 提供便捷静态方法：alert()、confirm()
 * 
 * @module FluentDialog
 */

// 样式定义（与之前一致）
const styles = `
:root {
  --border-radius-dialog: 8px;
  --border-radius-button: 4px;
  --shadow-modal: 0 16px 32px -8px rgba(0, 0, 0, 0.3), 0 8px 16px -6px rgba(0, 0, 0, 0.2);
  --bg-overlay: rgba(0, 0, 0, 0.4);
  --bg-dialog: rgba(255, 255, 255, 0.85);
  --bg-dialog-backdrop: rgba(255, 255, 255, 0.5);
  --bg-footer: rgba(0, 0, 0, 0.03);
  --text-primary: #1e1e1e;
  --text-secondary: #484848;
  --border-subtle: rgba(0, 0, 0, 0.08);
  --button-primary-bg: #0078d4;
  --button-primary-hover: #106ebe;
  --button-primary-active: #005a9e;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-xxl: 24px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-overlay: rgba(0, 0, 0, 0.6);
    --bg-dialog: rgba(32, 32, 32, 0.9);
    --bg-dialog-backdrop: rgba(32, 32, 32, 0.7);
    --bg-footer: rgba(255, 255, 255, 0.03);
    --text-primary: #ffffff;
    --text-secondary: #c8c8c8;
    --border-subtle: rgba(255, 255, 255, 0.08);
    --button-primary-bg: #4cc2ff;
    --button-primary-hover: #6acdff;
    --button-primary-active: #1c9ae8;
  }
}

.fluent-dialog {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.fluent-dialog.show {
  display: flex;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-overlay);
  backdrop-filter: blur(2px);
  animation: fadeIn 0.15s ease-out;
}

.dialog-container {
  position: relative;
  width: 420px;
  max-width: 90vw;
  background: var(--bg-dialog);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border-radius: var(--border-radius-dialog);
  box-shadow: var(--shadow-modal);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  animation: scaleIn 0.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}

.dialog-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-dialog-backdrop);
  border-radius: var(--border-radius-dialog);
  z-index: -1;
}

.dialog-header {
  padding: var(--spacing-xl) var(--spacing-xxl) 0 var(--spacing-xxl);
  margin-bottom: 15px;
}
.dialog-header h3 {
  font-size: 18px;
  font-weight: 1000;
  color: var(--text-primary);
  margin: 0;
  text-align: left;
}

.dialog-content {
  padding: 0 var(--spacing-xxl) var(--spacing-lg) var(--spacing-xxl);
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
  font-weight: 500;
}

.dialog-footer {
  padding: var(--spacing-lg) var(--spacing-xxl) var(--spacing-xl) var(--spacing-xxl);
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-footer);
  border-bottom-left-radius: var(--border-radius-dialog);
  border-bottom-right-radius: var(--border-radius-dialog);
}

.fluent-button.primary {
  padding: 8px 48px;
  border-radius: var(--border-radius-button);
  border: none;
  background: var(--button-primary-bg);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 120, 212, 0.3);
  transition: all 0.15s ease;
  min-width: 140px;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.fluent-button.primary:hover {
  background: var(--button-primary-hover);
  transform: scale(1.02);
}
.fluent-button.primary:active {
  background: var(--button-primary-active);
  transform: scale(0.98);
}
.fluent-button.primary:focus-visible {
  outline: 2px solid var(--button-primary-bg);
  outline-offset: 2px;
}

@keyframes scaleIn {
  0% { opacity: 0; transform: scale(1.075); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes scaleOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.075); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fluent-dialog.closing .dialog-overlay {
  animation: fadeIn 0.1s ease-out reverse;
}
.fluent-dialog.closing .dialog-container {
  animation: scaleOut 0.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
}
`;

/**
 * FluentDialog 类 - 创建并管理一个 Fluent Design 弹窗实例
 */
export class FluentDialog {
  /**
   * 创建一个弹窗实例。
   * @param {Object} options - 配置选项
   * @param {string} options.title - 弹窗标题
   * @param {string} options.content - 弹窗正文（HTML 字符串）
   * @param {Function} [options.onConfirm] - 点击“确定”按钮后的回调函数
   * @param {Function} [options.onClose] - 弹窗关闭后的回调函数
   */
  constructor({ title = '提示', content = '', onConfirm, onClose } = {}) {
    this.title = title;
    this.content = content;
    this.onConfirm = onConfirm || (() => {});
    this.onClose = onClose || (() => {});

    // 注入样式（仅首次创建时注入）
    if (!document.querySelector('#fluent-dialog-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'fluent-dialog-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }

    // 创建弹窗 DOM
    this.dialog = this._createDialog();
    document.body.appendChild(this.dialog);

    // 绑定元素引用
    this.overlay = this.dialog.querySelector('.dialog-overlay');
    this.confirmBtn = this.dialog.querySelector('#confirmBtn');
    this.titleEl = this.dialog.querySelector('#dialogTitle');
    this.contentEl = this.dialog.querySelector('#dialogDesc');

    // 初始化事件
    this._bindEvents();
  }

  /**
   * 创建弹窗的 HTML 结构
   * @private
   */
  _createDialog() {
    const dialogDiv = document.createElement('div');
    dialogDiv.className = 'fluent-dialog';
    dialogDiv.setAttribute('role', 'dialog');
    dialogDiv.setAttribute('aria-modal', 'true');
    dialogDiv.setAttribute('aria-labelledby', 'dialogTitle');
    dialogDiv.setAttribute('aria-describedby', 'dialogDesc');
    dialogDiv.innerHTML = `
      <div class="dialog-overlay" id="dialogOverlay"></div>
      <div class="dialog-container">
        <div class="dialog-header">
          <h3 id="dialogTitle">${this.title}</h3>
        </div>
        <div class="dialog-content" id="dialogDesc">${this.content}</div>
        <div class="dialog-footer">
          <button class="fluent-button primary" id="confirmBtn">确定</button>
        </div>
      </div>
    `;
    return dialogDiv;
  }

  /**
   * 绑定内部事件
   * @private
   */
  _bindEvents() {
    // 确定按钮关闭
    this.confirmBtn.addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dialog.classList.contains('show')) {
        this.close();
      }
    });

    // 阻止点击内容区冒泡
    this.dialog.querySelector('.dialog-container').addEventListener('click', (e) => e.stopPropagation());
  }

  /**
   * 打开弹窗
   */
  open() {
    this.dialog.classList.remove('closing');
    this.dialog.classList.add('show');
    this.confirmBtn.focus();
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
  }

  /**
   * 关闭弹窗（带动画）
   */
  close() {
    this.dialog.classList.add('closing');
    setTimeout(() => {
      this.dialog.classList.remove('show', 'closing');
      document.body.style.overflow = ''; // 恢复滚动
      this.onClose();
    }, 140); // 略小于动画时长 150ms
  }

  /**
   * 更新弹窗标题
   * @param {string} newTitle
   */
  setTitle(newTitle) {
    this.titleEl.textContent = newTitle;
  }

  /**
   * 更新弹窗内容（支持 HTML）
   * @param {string} newContent
   */
  setContent(newContent) {
    this.contentEl.innerHTML = newContent;
  }

  /**
   * 销毁弹窗 DOM，释放资源
   */
  destroy() {
    this.dialog.remove();
  }

  // ========== 便捷静态方法 ==========

  /**
   * 显示一个简单的提示弹窗（仅确定按钮）
   * @param {string} content - 提示内容（支持 HTML）
   * @param {string} [title='提示'] - 弹窗标题
   * @param {Function} [onConfirm] - 点击确定后的回调（可选）
   * @returns {FluentDialog} 创建的弹窗实例（通常无需保存）
   */
  static alert(content, title = '提示', onConfirm = null) {
    const dialog = new FluentDialog({
      title,
      content,
      onConfirm: onConfirm || (() => {})
    });
    dialog.open();
    return dialog;
  }

  /**
   * 显示一个确认弹窗（只有确定按钮，但可通过回调处理确认逻辑）
   * @param {string} content - 确认内容（支持 HTML）
   * @param {Function} onConfirm - 点击确定后的回调
   * @param {Function} [onClose] - 弹窗关闭后的回调（可选）
   * @param {string} [title='确认'] - 弹窗标题
   * @returns {FluentDialog} 创建的弹窗实例
   */
  static confirm(content, onConfirm, onClose = null, title = '确认') {
    const dialog = new FluentDialog({
      title,
      content,
      onConfirm,
      onClose
    });
    dialog.open();
    return dialog;
  }
}