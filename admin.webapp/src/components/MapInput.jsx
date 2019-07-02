import React, {Component} from 'react';

export default class MapInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initCoords: this.props.value || [55.76, 37.64],
    };
  }

  componentDidMount() {
    const _this = this;
    ymaps.ready(init);
    this.props.onChange(this.state.initCoords);

    function init() {
      const mapInput = new ymaps.Map('map', {
        center: _this.state.initCoords,
        zoom: 5,
      });

      const pointLocation = new ymaps.GeoObject({
        geometry: {
          type: 'Point',
          coordinates: _this.state.initCoords,
        }
      }, {
        draggable: true,
        preset: 'islands#redIcon',
      });

      mapInput.events.add('click', function (e) {
        const coordinates = e.get('coords');
        pointLocation.geometry.setCoordinates(coordinates);
        _this.setState({
          pointLocation: coordinates,
        }, () => {
          _this.props.onChange(_this.state.pointLocation);
        });
      });

      pointLocation.events.add('dragend', (e) => {
        const location = e.get('target');
        const coordsForLocation = location.geometry.getCoordinates();
        location.properties.set('balloonContent', coordsForLocation);

        _this.setState({
          pointLocation: coordsForLocation,
        }, () => {
          _this.props.onChange(_this.state.pointLocation);
        });
      });
      mapInput.geoObjects.add(pointLocation);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      if (this.props.value !== nextProps.value) {
        this.setState({
          initCoords: nextProps.value
        });
      }
    }
  }

  render() {
    return (
      <div id="map" style={{width: 600, height: 400}}></div>
    );
  }
}