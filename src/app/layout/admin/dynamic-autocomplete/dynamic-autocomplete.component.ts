import { Component, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'dynamic-autocomplete',
  templateUrl: './dynamic-autocomplete.component.html',
  styleUrls: ['./dynamic-autocomplete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicAutocompleteComponent),
      multi: true
    }
  ]
})
export class DynamicAutocompleteComponent implements OnInit, ControlValueAccessor {

  myControl = new FormControl();
  selectedValue;
  filteredOptions: Observable<string[]>;
  question = 'Would you like to add ';
  @Input() options: string[];
  @Output() added = new EventEmitter();

  // Function to call when the option changes.
  onChange = (option: string) => {};

  // Function to call when the input is touched (when the autocomplete is clicked).
  onTouched = () => {};

  get value() {
    return this.selectedValue;
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this.filter(option) : this.options.slice())
      );
  }

  optionSelected(option) {
    if (option.value.indexOf(this.question) === 0) {
      let newOption = option.value.substring(this.question.length).split('?')[0];
      this.options.push(newOption);
      this.added.emit(newOption);
      this.myControl.setValue(newOption);
      this.writeValue(newOption);
    } else {
      this.myControl.setValue(option.value);
      this.writeValue(option.value);
    }
  }

  enter() {
    const controlValue = this.myControl.value;
    if (!this.options.some(entry => entry === controlValue)) {
      this.added.emit(controlValue);
      const index = this.options.push(controlValue);
      setTimeout(
        () => {
          this.myControl.setValue(controlValue);
          this.writeValue(controlValue);
        }
      );
    } else {
      this.writeValue(controlValue);
    }
  }

  // Allows Angular to update the model (option).
  // Update the model and changes needed for the view here.
  writeValue(option: string): void {
    this.selectedValue = option;
    this.onChange(option);
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (option: string) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private filter(value: string): string[] {
    let results;
    if (value) {
      results = this.options
        .filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
      if (results.length < 1) {
        results = [this.question + value + '?'];
      }
    } else {
      results = this.options.slice();
    }
    return results;
  }

}