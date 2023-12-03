import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabelConfig, ShapeConfig } from 'src/app/model/labelData';

@Component({
  selector: 'app-labelConfig',
  templateUrl: './labelConfig.component.html',
  styleUrls: ['./labelConfig.component.scss']
})
export class LabelConfigComponent implements OnInit {

  textForm: FormGroup = this.builder.group({
    labelText: ['Label', Validators.required],
    labelSize: [20, Validators.required],
    labelColor: ['#fff', Validators.required],
    labelx: [1.67, Validators.required],
    labelY: [2.22, Validators.required],
  });

  shapeForm: FormGroup = this.builder.group({
    name: ['', Validators.required],
    fill: ['#000', Validators.required],
    width: [100, Validators.required],
    height: [100, Validators.required],
  });

  constructor(public dialogRef: MatDialogRef<LabelConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private builder: FormBuilder
  ) {
    if (data.label) {
      this.textForm.get('labelText').patchValue(data.label.labelText);
      this.textForm.get('labelSize').patchValue(data.label.labelSize);
      this.textForm.get('labelColor').patchValue(data.label.labelColor);
      this.textForm.get('labelx').patchValue(data.label.labelx);
      this.textForm.get('labelY').patchValue(data.label.labelY);
    }
    if (data.shape && data.shape.name === data.shapeName) {
      this.shapeForm.get('name').patchValue(data.shape.name);
      this.shapeForm.get('fill').patchValue(data.shape.fill);
      this.shapeForm.get('width').patchValue(data.shape.width);
      this.shapeForm.get('height').patchValue(data.shape.height);
    } else {
      this.shapeForm.get('name').patchValue(data.shapeName);
      this.shapeForm.get('width').patchValue(data.shapeName === 'Rectangle' ? 200 : 100);
      this.shapeForm.get('height').patchValue(data.shapeName === 'Ellipse' ? 200 : 100);
    }
  }

  ngOnInit() {
  }

  onNoClick(): void {
    const postData: { text: LabelConfig, shape: ShapeConfig } =
    {
      text: this.textForm.value,
      shape: this.shapeForm.value
    };
    this.dialogRef.close(postData);
  }
}
