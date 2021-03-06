import React, { Component } from 'react';
import {
    Button, Icon, Grid
} from 'semantic-ui-react';
import * as d3 from 'd3';
import axios from 'axios';

import './style/Home.css';
// import './resources/stock.jpg'

import Splash from './Splash'
import { connect } from 'react-redux';
import logo from './money.png'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: '',
            loading: false,
            splash: true,
            timePassed: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setTimePassed();
        }, 3000);
    }

    setTimePassed() {
        this.setState({ timePassed: true });
    }

    handleChange = e => {
        let { name, value } = e.target;
        this.setState({ [name]: String(value).trim().toUpperCase() });
    }

    handleFocus = () => {
        this.setState({
            loading: true,
            splash: false
        });
    }

    handleBlur = () => {
        this.setState({ loading: false });
    }

    handleSubmit = () => {
        let { ticker } = this.state;
        this.setState({ loading: false });

        axios.post('https://gainful-app.herokuapp.com/lasso/predict/', { ticker })
            .then(res => {
                if (res.data.success) {
                    let { data } = res.data;
                    let keys = Object(res.data.data).keys;
                    let dataArr = [];
                    let lastValue = 0;

                    Object.keys(data).map((v, i) => {
                        let date = new Date(v);
                        let value = data[v];

                        if (date.getDay() !== 0 && date.getDay() !== 6)
                            dataArr.push({
                                date, value
                            });
                    });

                    this.drawChart(dataArr);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    drawChart = data => {
        var svgWidth = 600, svgHeight = 400;
        var margin = { top: 20, right: 20, bottom: 30, left: 50 };
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        var svg = d3.select('svg');

        svg.selectAll("*").remove();
        svg.attr("width", svgWidth)
        svg.attr("height", svgHeight);

        var g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        var x = d3.scaleTime().rangeRound([0, width]);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        var line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        x.domain(d3.extent(data, d => d.date));
        y.domain(d3.extent(data, d => d.value));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .select(".domain")
            .remove();

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Price ($)");

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }

    render() {
        if (!this.state.timePassed) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <img src={logo} alt="Logo"></img>
                </div >
            );
        } else {
            return (
                <React.Fragment>
                    <Grid columns={1} className="center aligned">
                        <Grid.Row>
                            <Grid.Column>
                                <div class="ui input">
                                    <input type="text"
                                        name="ticker"
                                        value={this.state.ticker}
                                        onChange={this.handleChange}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholder="Enter Ticker Symbol"
                                        style={{ border: 'solid 1px black' }}
                                         />
                                </div>
                                <Button animated onClick={this.handleSubmit} style={{ backgroundColor: 'black', color: 'white' }}>
                                    <Button.Content visible>Predict</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='random' />
                                    </Button.Content>
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {this.state.loading ? <div style={{ marginTop: 200 }} className="ui active centered inline loader"></div> : <svg></svg>}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </React.Fragment>
            );
        }
    }
}

export default connect(null, null)(Home);
