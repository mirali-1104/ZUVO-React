const Host = require('../models/Host');

// Get total count of hosts
exports.getHostCount = async (req, res) => {
  try {
    // Check if admin - more robust check using both req.userType and req.user.role if available
    if (req.userType !== 'admin' && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access host count data'
      });
    }
    
    const count = await Host.countDocuments();
    
    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting host count:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get host count'
    });
  }
};

// Get all hosts for admin panel with pagination and filtering
exports.getAllHostsForAdmin = async (req, res) => {
  try {
    // Check if admin
    if (req.userType !== 'admin' && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access host data'
      });
    }
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const filter = {};
    if (req.query.name) filter.name = new RegExp(req.query.name, 'i');
    if (req.query.email) filter.email = new RegExp(req.query.email, 'i');
    if (req.query.isVerified === 'true') filter.isVerified = true;
    if (req.query.isVerified === 'false') filter.isVerified = false;
    
    // Sorting
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
    // Execute query with pagination
    const hosts = await Host.find(filter)
      .select('-password') // Exclude sensitive information
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const totalHosts = await Host.countDocuments(filter);
    
    // Get total earnings for each host
    const hostsWithEarnings = await Promise.all(
      hosts.map(async (host) => {
        // You would calculate actual earnings here from bookings
        // This is a placeholder - in a real implementation, you would
        // query the bookings collection and sum up completed bookings
        const hostData = host.toObject();
        
        // You can use actual calculation logic here when implementing bookings stats
        hostData.earnings = Math.floor(Math.random() * 10000); // Placeholder for demo
        
        return hostData;
      })
    );
    
    return res.status(200).json({
      success: true,
      hosts: hostsWithEarnings,
      pagination: {
        totalHosts,
        totalPages: Math.ceil(totalHosts / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching hosts for admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch hosts',
      details: error.message
    });
  }
}; 