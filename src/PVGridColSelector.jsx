import React from 'react';
import PVGremlinComboBox from './PVGremlinComboBox';
import { Flex } from 'reflexbox';
import PontusComponent from './PontusComponent';

class PVGridColSelector extends PontusComponent {
  constructor(props) {
    super(props);

    this.req = null;

    this.state = { checkedFuzzy: false };
    this.nodePropertyNamesReactSelect = null;
    this.propsSelected = null;

    this.namespace = this.props.namespace || '';
  }

  handleResize = () => {
    if (this.grid) {
      this.grid.resizeCanvas();
      this.onViewportChanged();
    }
  };

  onError = err => {
    console.error('error loading pages ' + err);
  };
  onChangeVertexLabels = val => {
    // alert("got data " + val);
    // this.props.glEventHub.emit('userSearch-on-boxChanged')

    this.nodePropertyNamesReactSelect.getOptions({ labels: val });
    this.props.glEventHub.emit(this.namespace + '-pvgrid-on-extra-search-changed', val);
  };

  onChangeNodePropertyNames = val => {
    // alert("got data " + val);
    // this.props.columnSettings = [
    //   {id: "name", name: "Name", field: "name", sortable: true},
    //
    //   {id: "street", name: "Street", field: "street", sortable: true}
    // ];

    const colSettings = [];

    this.propsSelected = [];

    if (val) {
      for (let i = 0, ilen = val.length; i < ilen; i++) {
        colSettings.push({ id: val[i].value, name: val[i].label, field: val[i].value, sortable: true });
        this.propsSelected.push(val[i].value);
      }
    }

    // for (val)

    this.props.glEventHub.emit(this.namespace + '-pvgrid-on-col-settings-changed', colSettings);
  };

  setObjNodePropertyNames = reactSelect => {
    this.nodePropertyNamesReactSelect = reactSelect;
  };

  render() {
    const nodeTypesVal = this.props.dataType
      ? { label: PontusComponent.replaceAll('.', ' ', PontusComponent.replaceAll('_', ' ', this.props.dataType)), value: this.props.dataType }
      : {};

    const nodeTypesReq = { labels: nodeTypesVal };

    const propTypesVal = [];

    if (this.props.colSettings) {
      for (const setting of this.props.colSettings) {
        propTypesVal.push({ label: setting.name, value: setting.id });
      }
    }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Flex wrap={true} align={'stretch'} width={'100%'}>
          <div style={{ display: 'block', width: '100%', padding: '10px' }}>
            <PVGremlinComboBox
              namespace={`${this.namespace}-node-types`}
              name="node-types"
              multi={false}
              onChange={this.onChangeVertexLabels}
              onError={this.onError}
              url={PontusComponent.getRestVertexLabelsURL(this.props)}
              placeholder={PontusComponent.t('Data Type')}
              // style={{width: "100%"}}
              value={nodeTypesVal}
            />
          </div>
          <Flex h={1} w={1} align="center" style={{ height: '30px' }} />

          <div style={{ display: 'block', width: '100%', padding: '10px' }}>
            <PVGremlinComboBox
              name="node-property-types"
              namespace={`${this.namespace}-node-property-types`}
              multi={true}
              onChange={this.onChangeNodePropertyNames}
              onError={this.onError}
              ref={this.setObjNodePropertyNames}
              url={PontusComponent.getRestNodePropertyNamesURL(this.props)}
              placeholder={PontusComponent.t('Columns')}
              optionsRequest={nodeTypesReq}
              value={propTypesVal}
            />
          </div>
        </Flex>
      </div>
    );
  }
}

export default PVGridColSelector;
