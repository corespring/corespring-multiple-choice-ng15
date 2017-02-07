import debounce from 'lodash.debounce';
import 'corespring-legacy-multiple-choice'

export class CorespringNg15Element extends HTMLElement {

  constructor() {
    super();

    this._model = null;
    this._session = null;

    let update = () => {
      console.log('[update]');
      this.setDataAndSession();
      this.setMode();
      this.setEditable();
      this.setResponse();
      this._scope.$apply(() => {
      });
    }

    this._updateBridge = debounce(update, 40);
  }

  set model(s) {
    this._model = s;
    this._updateBridge();
  }

  get session() {
    return this._session;
  }

  set session(s) {
    this._session = s;
    this._updateBridge();
  }

  _onChange(data) {
    var event = new CustomEvent('pie', {
      bubbles: true,
      detail: {
        type: 'sessionChanged',
        component: this.tagName.toLowerCase()
      }
    });

    this.dispatchEvent(event);
  }

  _legacyHtml() {
    console.warn('_legacyHtml should be overridden');
    return "";
  }

  _rerender() {
    console.log('>> re-render');
    this.className = "corespring-player";
    this.innerHTML = this._legacyHtml();

    var $body = angular.element(this);

    var self = this;
    $body.injector().invoke(function ($compile) {
      var scope = $body.scope();
      self._scope = scope;
      scope.$on('registerComponent', function (evt, id, bridge, element) {
        if (element.parentElement === self) {
          self.registerLegacyComponent(bridge);
        }
      });
      $compile($body)(scope);
    });

    this._updateBridge();

  }

  connectedCallback() {
    try {
      var appId = 'corespring-legacy-app-' + Math.random();
      angular.module(appId, ['corespring-legacy-components'])
      angular.bootstrap(this, [appId]);
    } catch (e) {
      console.log("Error creating angular app:", appId);
    }
    this.dispatchEvent(new CustomEvent('pie.register', { bubbles: true }));
    this.addEventListener('pie', this.handlePieEvents);
    this._rerender();
  }

  disconnectedCallback() {
    this.removeEventListener('pie', this.handlePieEvents);
  }


  registerLegacyComponent(bridge) {
    this._bridge = bridge;
    this.setAnswerChangedHandler();
    this.setPlayerSkin();
    this.setDataAndSession();
    this.setMode();
    this.setEditable();
    this.setResponse();
  }

  setAnswerChangedHandler() {
    let self = this;
    this._bridge.answerChangedHandler(() => {
      self._session.value = self._bridge.getSession();
      self._onChange();
    });
  }

  setDataAndSession() {
    if (this._model && this._session && this._bridge) {
      this._bridge.setDataAndSession({
        data: this._model.question, session: this._session.value
      });
    }
  }

  setEditable() {
    if (this._model && this._model.env && this._session && this._bridge) {
      console.log('set editable to: ', this._model.env.mode === 'gather');
      this._bridge.editable(this._model.env.mode === 'gather');
    }
  }

  setMode() {
    if (this._model && this._model.env && this._session && this._bridge) {
      console.log('setMode: ', this._model.env.mode);
      this._bridge.setMode(this._model.env.mode);
    }
  }

  setResponse() {
    if (this._model && this._model.response && this._session && this._bridge) {
      console.log('setResponse: ', _.cloneDeep(this._model.response));
      this._bridge.setResponse(_.cloneDeep(this._model.response));
    } else {
      this._bridge.setResponse({});
    }

  }

  setPlayerSkin() {
    if (this._bridge) {
      this._bridge.setPlayerSkin({
        iconSet: "emoji",
        colors: {
          "correct-background": "#4aaf46",
          "correct-foreground": "#f8ffe2",
          "partially-correct-background": "#c1e1ac",
          "incorrect-background": "#fcb733",
          "incorrect-foreground": "#fbf2e3",
          "hide-show-background": "#bce2ff",
          "hide-show-foreground": "#1a9cff",
          "warning-background": "#464146",
          "warning-foreground": "#ffffff",
          "warning-block-background": "#e0dee0",
          "warning-block-foreground": "#f8f6f6",
          "muted-foreground": "#F8F6F6",
          "muted-background": "#E0DEE0"
        }
      });
    }
  }
}

export default class CorespringMultipleChoiceNg15Element extends CorespringNg15Element {
  _legacyHtml() {
    return '<multiple-choice id="' + this.getAttribute('pie-id') + '"></multiple-choice>';
  }
}


