import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';


Font.register({ family: 'OpenSans', src: require('../../fonts/OpenSans-Regular.ttf') })

// Create styles
const styles = StyleSheet.create({
  page: {
    // flexDirection: 'row',
    // backgroundColor: '#E4E4E4',
    fontFamily: 'OpenSans',
  },
  week: {
    margin: 10,
    // padding: 10,
    textAlign: 'center',
    fontSize: 22,
    backgroundColor: '#e4e4e4',
  },
  day: {
    paddingLeft: 10,
    marginLeft: 3,
    marginRight: 10,
    marginTop: 5,
    // padding: 10,
    fontSize: 16,
    // backgroundColor: '#e4e4e4',
  },
  eatTime: {
    width: '20%',
    marginLeft: 15,
    // padding: 10,
    fontSize: 13,
  },
  recipe: {
    paddingTop: 5,
    marginLeft: 30,
    // padding: 10,
    fontSize: 11,
  },
  fill_1: {
    height: 1,
    textAlign: 'center',
    // marginLeft: 10,
    // marginRight: 10,
    backgroundColor: '#e4e4e4',
  },
  fill_2: {
    height: 4,
    textAlign: 'center',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#e4e4e4',
  },
  row: {
    // flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 20,
  }
});

// Create Document Component
const MyDocument = (props) => {
  const { weeks } = props.location;
  console.log('pdf props >>>', weeks)
  return <div style={{ height: 500 }}>
    <PDFViewer width='100%' height='100%' >
      <Document>
        {weeks.map((week, wIndex) => <Page key={week.name} size="A4" style={styles.page}>
          <View style={styles.week}><Text>Неделя: {wIndex + 1}</Text></View>
          <View>
            {week.weekDays.filter(d => d.notEmpty)
            .map(day => <View key={day.name}>
              {/* <View style={styles.fill_1}/> */}
              <Text style={styles.day} >{day.title}</Text>
              <View style={styles.fill_2}/>
              {day.eatTimes.filter(et => et.menuRecipes.length > 0)
              .map(eatTime => <View style={styles.row} key={eatTime.name}>
                <View style={styles.eatTime}>
                  <Text >{eatTime.title}</Text>
                  <View style={styles.fill_1}/>
                </View> 
                <View>
                  {eatTime.menuRecipes.map(menuRecipe => <View key={menuRecipe.id}>
                    <Text style={styles.recipe}>{menuRecipe.recipe.name}</Text>
                  </View>)}                  
                </View>
              </View> )}
            </View> )}
          </View>
        </Page>)}
      </Document>
    </PDFViewer>
  </div>

};

export default MyDocument;
