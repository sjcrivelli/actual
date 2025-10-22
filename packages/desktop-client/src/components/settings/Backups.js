"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backups = Backups;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var UI_1 = require("./UI");
function Backups() {
    var BACKUP_FREQUENCY_MINS = 15;
    var MAX_BACKUPS = 10;
    return (<UI_1.Setting>
      <text_1.Text>
        <strong>
          <react_i18next_1.Trans>Backups</react_i18next_1.Trans>
        </strong>
        <p>
          <react_i18next_1.Trans>
            Backups are taken every {{ BACKUP_FREQUENCY_MINS: BACKUP_FREQUENCY_MINS }} minutes and
            stored in{' '}
            <strong>
              <i>Actual’s data directory</i>
            </strong>
            . Actual retains a maximum of {{ MAX_BACKUPS: MAX_BACKUPS }} backups at any time.
          </react_i18next_1.Trans>
        </p>
      </text_1.Text>
    </UI_1.Setting>);
}
