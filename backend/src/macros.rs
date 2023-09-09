pub fn hypot(x:f64, y:f64)-> f64 {
    let num = x.powi(2) + y.powi(2);
    num.powf(0.5)
}

pub fn bool_or(booleans : &Vec<bool>) -> bool {
    let mut result = false;
    for i in booleans {
        result = result || *i;
    }
    result
}

pub fn sigmoid(x : f64) -> f64 {
    1.0 / (1.0 + (-x).exp())
}