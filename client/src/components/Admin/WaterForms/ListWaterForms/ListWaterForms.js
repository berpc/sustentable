import React, { useState, useEffect } from "react";
import { Loader, Pagination, Table, Grid, GridColumn, Input, Divider, Button, Modal, Dropdown, TableHeaderCell, TableRow } from "semantic-ui-react";
import { size, map } from "lodash";
import { Waterform } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { WaterFormItem } from "../WaterFormItem";
import {
  hasPermission,
  isAdmin,
  isMaster,
} from "../../../../utils/checkPermission";
import "./ListWaterForms.scss";
const _ = require("lodash");


const waterFormController = new Waterform();

export function ListWaterForms(props) {
  const { reload, onReload , siteSelected} = props;
  const [waterForms, setWaterForms] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
    // const [Role, setRole] = useState(null);
    const {
      user: { role, site },
      accessToken,
    } = useAuth();
  

  useEffect(() => {
    (async () => {
      try {
        let limit=50;
        let options={ page, limit };
        if(site){
          options.site=site?._id;
        }else if(siteSelected){
          options.site=siteSelected;
        }
        const response = await waterFormController.getWaterForms(accessToken,options);
        if(response.docs){
          setWaterForms(response.docs);
        }else{
          setWaterForms([]);
        }
        
        // setSites(response.docs);
        setPagination({
          limit: response.limit,
          page: response.current,
          pages: response.pages,
          total: response.total,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [page, reload]);

  const changePage = (_, data) => {
    setPage(data.activePage);
  };

  if (!waterForms) return <Loader active inline="centered" />;
  if (size(waterForms) === 0) return "No hay resultados ";

  return (
    <div className="list-water-forms">
      {/* {map(siteforms, (siteForm) => (
        <SiteFormItem key={siteForm._id} siteForm={siteForm} onReload={onReload} />
      ))} */}

      <div className="list-water-forms__pagination">
          {/* <SearchStandardPermission
            dataOrigin={siteforms}
            // data={permissionsFilter}
            // setData={setPermissionsFilter}
          /> */}
        </div>
        <Divider clearing/>

      <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell >Fecha</Table.HeaderCell>
                <Table.HeaderCell>Usuario Creador</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {map(waterForms, (waterForm) => (
              //TODO:DESCOMENTAR CUANDO ESTE TODO COMPLETO
               <WaterFormItem key={waterForm._id} waterForm={waterForm} onReload={onReload} />
              ))
      }
           </Table.Body>
           </Table>
        {/* <Pagination
          totalPages={pagination.pages}
          defaultActivePage={pagination.page}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}--
          onPageChange={changePage}
        /> */}
        <Pagination
        activePage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={changePage}
      />  
      </div>
  );
}


function SearchStandardPermission(props) {
  const { dataOrigin, data, setData } = props;
  const [state, setState] = useState({
    isLoading: false,
    results: [],
    value: "",
  });

  const handleSearchChange = (e, { value }) => {
    setState({ isLoading: true, value });

    setTimeout(() => {
      if (value && value.length < 1) {
        setState({ isLoading: false, results: [], value: "" })
        setData(dataOrigin);
        return true;
      } else if (value.length === 0) {
        setData(dataOrigin);
        setState({ isLoading: false, results: [], value: "" });
        return true;
      }
      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result.role.name);
      setState({
        isLoading: false,
        results: _.filter(data, isMatch),
      });
      setData(_.filter(data, isMatch));
    }, 300);
  };


  return (
    <Grid>
      <GridColumn width={6}>
      <Input
       icon='search'
       iconPosition='left'
      placeholder='Buscar...'
    onChange={_.debounce(handleSearchChange, 500, {
      leading: true,
    })}
        />
      </GridColumn>
    </Grid>
  );
}

function TablePeriods (props){
  // Datos de ejemplo
 // Datos de ejemplo
  // Datos de ejemplo actualizados
  const data = [
    {
      period: 'Enero',
      electricity: { value: 100, code: 'E100' },
      water: { value: 30, code: 'W30' }
    },
    {
      period: 'Febrero',
      electricity: { value: 120, code: 'E120' },
      water: { value: 40, code: 'W40' }
    },
    {
      period: 'Marzo',
      electricity: { value: 110, code: 'E110' },
      water: { value: 35, code: 'W35' }
    },
    {
      period: 'Abril',
      electricity: { value: 95, code: 'E95' },
      water: { value: 20, code: 'W20' }
    },
    {
      period: 'Mayo',
      electricity: { value: 115, code: 'E115' },
      water: { value: 45, code: 'W45' }
    }
  ];
  // Estado para controlar el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Función para abrir el modal con datos del período seleccionado
  const handleOpenModal = (period) => {
    setSelectedPeriod(data.find(item => item.period === period));
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPeriod(null);
  };

// Obtén los nombres de los períodos para las columnas
const periods = data.map(item => item.period);

  // Obtén los valores de electricidad y agua
  const electricityValues = data.map(item => item.electricity.value);
  const waterValues = data.map(item => item.water.value);
  
  // Códigos de electricidad y agua
  // const electricityCodes = data.map(item => item.electricity.code);
  // const waterCodes = data.map(item => item.water.code);
  const codes = {
    electricityCode: 'E100',
    waterCode: 'W30'
  };
  
  // Calcula el total y el promedio para electricidad
  const totalElectricity = electricityValues.reduce((acc, val) => acc + val, 0);
  const averageElectricity = totalElectricity / electricityValues.length;
  
  // Calcula el total y el promedio para agua
  const totalWater = waterValues.reduce((acc, val) => acc + val, 0);
  const averageWater = totalWater / waterValues.length;

return (
  <>
  <Table celled>
    <Table.Header>
      <Table.Row>
      <Table.HeaderCell>Codigo</Table.HeaderCell>
        <Table.HeaderCell>Item</Table.HeaderCell>
        {periods.map((period, index) => (
          <Table.HeaderCell key={index}>{period}
              <Dropdown
                  button
                  icon='ellipsis vertical'
                  floating
                  className='icon'
                  style={{ marginLeft: '10px' }}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text='Ver Detalles'
                      onClick={() => handleOpenModal(period)}
                    />
                  </Dropdown.Menu>
                </Dropdown></Table.HeaderCell>
        ))}
                 <Table.HeaderCell>Total</Table.HeaderCell>
                 <Table.HeaderCell>Promedio</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
      <Table.Cell>      {codes.electricityCode}</Table.Cell>
        <Table.Cell>Electricidad</Table.Cell>
        {electricityValues.map((value, index) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ))}
                <Table.Cell>{totalElectricity}</Table.Cell>
                <Table.Cell>{averageElectricity.toFixed(2)}</Table.Cell>
      </Table.Row>
      <Table.Row>
      <Table.Cell>      {codes.waterCode}</Table.Cell>
        <Table.Cell>Agua</Table.Cell>
        {waterValues.map((value, index) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ))}
          <Table.Cell>{totalWater}</Table.Cell>
          <Table.Cell>{averageWater.toFixed(2)}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
   {/* Modal para mostrar detalles del período seleccionado */}
   {selectedPeriod && (
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          size='small'
        >
          <Modal.Header>Detalles del Período: {selectedPeriod.period}</Modal.Header>
          <Modal.Content>
            <p>Electricidad: {selectedPeriod.electricity.value}</p>
            <p>Agua: {selectedPeriod.water.value}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseModal} color='black'>
              Cerrar
            </Button>
          </Modal.Actions>
        </Modal>
      )}
  </>
);
};