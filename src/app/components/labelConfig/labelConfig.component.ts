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
    @Inject(MAT_DIALOG_DATA) public data: string,
    private builder: FormBuilder
  ) {
    this.shapeForm.get('name').patchValue(data);
    this.shapeForm.get('width').patchValue(data === 'Rectangle' ? 200 : 100);
    this.shapeForm.get('height').patchValue(data === 'Ellipse' ? 200 : 100);
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
