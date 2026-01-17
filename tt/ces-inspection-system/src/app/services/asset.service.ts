import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Asset, TerminalLocation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private assets: Asset[] = [];
  private assetsSubject = new BehaviorSubject<Asset[]>([]);
  public assets$ = this.assetsSubject.asObservable();

  private terminals: TerminalLocation[] = [];
  private terminalsSubject = new BehaviorSubject<TerminalLocation[]>([]);
  public terminals$ = this.terminalsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.terminals = [
      {
        locationId: 'loc-001',
        locationName: 'Berth 1',
        terminalCode: 'APMT_LBC',
        gpsCoordinates: '1.3644,103.8735'
      },
      {
        locationId: 'loc-002',
        locationName: 'Yard Block A',
        terminalCode: 'YRD_BLK_A',
        gpsCoordinates: '1.3650,103.8740'
      }
    ];    this.assets = [
      {
        assetId: 'asset-001',
        locationId: 'loc-001',
        assetCode: 'STS-001',
        assetType: 'STS',
        description: 'Straddle Carrier Unit 1',
        manufacturer: 'Kalmar',
        modelNumber: 'DRF450-65H5',
        serialNumber: 'KLM2023001',
        acquisitionDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2025-01-15'),
        diagramUrl: 'https://via.placeholder.com/700x500?text=STS-001+2D+Drawing'
      },
      {
        assetId: 'asset-002',
        locationId: 'loc-001',
        assetCode: 'RTG-001',
        assetType: 'RTG',
        description: 'Rubber Tyred Gantry 1',
        manufacturer: 'Liebherr',
        modelNumber: 'LPS 500',
        serialNumber: 'LBR2023002',
        acquisitionDate: new Date('2023-03-20'),
        warrantyExpiry: new Date('2025-03-20'),
        diagramUrl: 'https://via.placeholder.com/700x500?text=RTG-001+2D+Drawing'
      }
    ];

    this.terminalsSubject.next(this.terminals);
    this.assetsSubject.next(this.assets);
  }

  getAssets(): Observable<Asset[]> {
    return this.assets$;
  }

  getAssetById(id: string): Asset | undefined {
    return this.assets.find(a => a.assetId === id);
  }

  addAsset(asset: Asset): void {
    this.assets.push(asset);
    this.assetsSubject.next([...this.assets]);
  }

  updateAsset(asset: Asset): void {
    const index = this.assets.findIndex(a => a.assetId === asset.assetId);
    if (index !== -1) {
      this.assets[index] = asset;
      this.assetsSubject.next([...this.assets]);
    }
  }

  deleteAsset(id: string): void {
    this.assets = this.assets.filter(a => a.assetId !== id);
    this.assetsSubject.next([...this.assets]);
  }

  getTerminals(): Observable<TerminalLocation[]> {
    return this.terminals$;
  }

  getTerminalById(id: string): TerminalLocation | undefined {
    return this.terminals.find(t => t.locationId === id);
  }

  addTerminal(terminal: TerminalLocation): void {
    this.terminals.push(terminal);
    this.terminalsSubject.next([...this.terminals]);
  }

  updateTerminal(terminal: TerminalLocation): void {
    const index = this.terminals.findIndex(t => t.locationId === terminal.locationId);
    if (index !== -1) {
      this.terminals[index] = terminal;
      this.terminalsSubject.next([...this.terminals]);
    }
  }

  deleteTerminal(id: string): void {
    this.terminals = this.terminals.filter(t => t.locationId !== id);
    this.terminalsSubject.next([...this.terminals]);
  }
}
