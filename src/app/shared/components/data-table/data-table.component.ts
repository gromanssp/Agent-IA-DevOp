import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  template: `
    <div class="table-wrapper glass-panel">
      <table [class.striped]="striped" [class.hover]="hover" [class.bordered]="bordered">
        <thead>
          <tr>
            @for (col of columns; track col.key) {
              <th [style.width]="col.width">{{ col.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data; track $index) {
            <tr>
              @for (col of columns; track col.key) {
                <td>{{ row[col.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() striped = false;
  @Input() hover = true;
  @Input() bordered = false;
}
