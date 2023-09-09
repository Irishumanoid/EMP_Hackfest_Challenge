pub fn hypot(x:f64, y:f64)-> f64 {
    let num = x.powi(2) + y.powi(2);
    num.powf(0.5)
}