import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css'
})
export class BarComponent implements OnInit{
  private data = [
    {"Month": "Jan", "Sales": "16443", "Released": "2014"},
    {"Month": "Feb", "Sales": "50073", "Released": "2013"},
    {"Month": "Mars", "Sales": "82342", "Released": "2016"},
    {"Month": "April", "Sales": "107647", "Released": "2010"},
    {"Month": "June", "Sales": "81471", "Released": "2011"},
    {"Month": "July", "Sales": "60141", "Released": "2011"},
    {"Month": "Aug", "Sales": "90471", "Released": "2011"},
    {"Month": "Sept", "Sales": "121471", "Released": "2011"},
    {"Month": "Oct", "Sales": "81471", "Released": "2011"},
    {"Month": "Nov", "Sales": "72171", "Released": "2011"},
    {"Month": "Dec", "Sales": "101171", "Released": "2011"},
  ];
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 500 - (this.margin * 2);
  
  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
}
  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.Month))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => x(d.Month))
    .attr("y", (d: any) => y(d.Sales))
    .attr("width", x.bandwidth())
    .attr("height", (d: any) => this.height - y(d.Sales))
    .attr("fill", "#2a5b88");
  }
}
