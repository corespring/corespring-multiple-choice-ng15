//TODO: We are importing a transitive dependency here - which is unsafe.
import CorespringNg15Element from 'corespring-legacy-component-dependencies/support/corespring-ng15-element';
import 'corespring-legacy-multiple-choice';

export default class CorespringMultipleChoiceNg15Element extends CorespringNg15Element {
  _legacyHtml() {
    return '<multiple-choice id="' + this.getAttribute('pie-id') + '"></multiple-choice>';
  }
}


