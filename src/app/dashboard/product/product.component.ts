import { ViewChild, Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: any;
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'purchase',
    'sell',
    'stocks',
    'supplier',
    'code',
    'option',
  ];
  dataSource: any;

  constructor(
    private appService: AppService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  ngOnInit(): void {
    this.appService.getProducts().subscribe(
      (response) => {
        this.products = response.data;
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.products);
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  create() {
    alert('Create Data');
  }

  view(id: number) {
    alert('View QR ' + id);
  }

  printQR(id: number) {
    alert('Print QR Code ' + id);
  }

  update(id: number) {
    alert('Update Data ' + id);
  }

  delete(id: number) {
    alert('Delete Data ' + id);
  }
}
