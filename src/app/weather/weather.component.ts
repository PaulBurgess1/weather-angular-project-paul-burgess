import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, map, Observable} from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  private API_KEY: string= "d842da581fbc5da3a478b0c8aa551b4c";
  private URL_BASE: string="https://api.openweathermap.org/data/2.5/";
  search: FormControl = new FormControl();

  //City name, Country code (ISO 3166-1 alpha-2)
  location:string[] = new Array(2);
  //day, date, month, year
  date:any[4];
  //main, description
  weather:string[]= new Array(2);
  //Celsius, Fahrenheit, Kelvin
  temperature:number[]= new Array(3);
  //humidity (%), wind speed(m/s), pressure (hPa), sunrise time (HH:MM), sunset time(HH:MM)
  information:any[]= new Array(5);
  //FontAwesome icon to match weather type
  icon:string='';


  //
  constructor(private http:HttpClient) { 
    this.getWeather("toronto");
  }

  ngOnInit() {
    this.getFullDate();
  }
  //methods
  getFullDate (){
    var d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    this.date = [days[d.getDay()],d.getDate(),month[d.getMonth()],d.getFullYear()];
  }
  setIcon (weather: string){
    //Fontawesome icons
    const ICON_DICT: { [key: string]: string } ={
      "Clear": "fas fa-sun",
      "Rain": "fas fa-cloud-rain",
      "Snow": "fas fa-snowflake",
      "Clouds": "fas fa-cloud",
      "Thunderstorm": "fas fa-bolt",
      "Dizzle": "fas fa-cloud-sun-rain",
      "Misc": "fas fa-smog"
    }
    var temp =ICON_DICT[weather];
    if (!temp){
      temp =ICON_DICT["Misc"];
    }
    this.icon=temp;
  }
  getWeather(city: string){
    let result:Observable<any>=this.http.get(this.URL_BASE+'weather?q='+city+'&units=metric&appid='+this.API_KEY)
      .pipe(catchError( err =>{
        alert("Error "+err.status+": "+err.statusText);
        return EMPTY;
      }));
    result.pipe(map(x=>{return x})).subscribe( res=>{
      this.location=[res['name'],res['sys']['country']];

      this.weather=[res['weather'][0]['main'], res['weather'][0]['description']]
      this.setIcon(res['weather'][0]['main']);

      let temp: number =res['main']['temp'];
      this.temperature[0]=Math.round(temp);
      this.temperature[1]=(Math.round(temp*9/5)+3);
      this.temperature[2]=Math.round(temp)+273;

      this.information[0]=res['main']['humidity'];
      this.information[1]=res['wind']['speed'];
      this.information[2]=res['main']['pressure'];
      //* 1000 to convert from being in seconds to miliseconds 
      this.information[3]=new Date(res['sys']['sunrise']* 1000).toLocaleTimeString('en-US', { hour12: false ,timeZone: 'UTC'});
      this.information[4]=new Date(res['sys']['sunset']* 1000).toLocaleTimeString('en-US', { hour12: false,timeZone: 'UTC' });
    });
  }
}
